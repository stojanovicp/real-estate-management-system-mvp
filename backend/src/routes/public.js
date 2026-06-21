const express = require('express');
const { Building, Apartment, Inquiry } = require('../../models');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/buildings
router.get('/buildings', asyncHandler(async (req, res) => {
  const buildings = await Building.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']]
  });
  res.json(buildings);
}));

// GET /api/buildings/:id
router.get('/buildings/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const building = await Building.findOne({ where: { id, isActive: true } });
  if (!building) {
    return res.status(404).json({ message: 'Zgrada nije pronađena' });
  }

  res.json(building);
}));

// GET /api/buildings/:id/apartments
router.get('/buildings/:id/apartments', asyncHandler(async (req, res) => {
  const buildingId = Number(req.params.id);

  const apartments = await Apartment.findAll({
    where: { buildingId }
  });

  res.json(apartments);
}));

// GET /api/apartments/:id
router.get('/apartments/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const apartment = await Apartment.findByPk(id);
  if (!apartment) {
    return res.status(404).json({ message: 'Stan nije pronađen' });
  }

  const data = apartment.toJSON();
  if (!data.isPricePublic) {
    delete data.price;
    data.priceOnRequest = true;
  }

  res.json(data);
}));

// POST /api/inquiries
router.post('/inquiries', asyncHandler(async (req, res) => {
  const { apartmentId, name, email, phone, message } = req.body;

  if (!apartmentId) {
    return res.status(400).json({ message: 'apartmentId je obavezan' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Polja name, email i message su obavezna' });
  }

  const idNum = Number(apartmentId);
  if (Number.isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({ message: 'apartmentId mora biti pozitivan broj' });
  }

  const apartment = await Apartment.findByPk(idNum);
  if (!apartment) {
    return res.status(404).json({ message: 'Stan nije pronađen' });
  }

  const inquiry = await Inquiry.create({
    apartmentId: idNum,
    name,
    email,
    phone: phone ?? null,
    message,
    status: 'NEW'
  });

  res.status(201).json(inquiry);
}));


module.exports = router;
