const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');
const { Inquiry, Apartment, Building } = require('../../models');


router.get('/test', auth, (req, res) => {
  res.json({
    message: 'Autorizovan pristup',
    user: req.user
  });
});

router.get('/inquiries',auth, requireRole('admin'), asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.findAll({
      include: {
        model: Apartment,
        as: 'apartment',
        attributes: ['id', 'number']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(inquiries);
  })
);

router.get(
  '/buildings',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const buildings = await Building.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json(buildings);
  })
);

router.post(
  '/buildings',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        message: 'Naziv i adresa su obavezni'
      });
    }

    const building = await Building.create({ name, address });

    res.status(201).json(building);
  })
);
router.put(
  '/buildings/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;

    const building = await Building.findByPk(id);

    if (!building) {
      return res.status(404).json({ message: 'Zgrada ne postoji' });
    }

    building.name = name ?? building.name;
    building.address = address ?? building.address;

    await building.save();

    res.json(building);
  })
);
router.delete(
  '/buildings/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const building = await Building.findByPk(id);

    if (!building) {
      return res.status(404).json({ message: 'Zgrada ne postoji' });
    }

    await building.destroy();

    res.json({ message: 'Zgrada uspešno obrisana' });
  })
);

router.get(
  '/apartments',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const apartments = await Apartment.findAll({
      include: [
        {
          model: Building,
          as: 'building',
          attributes: ['id', 'name', 'address']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(apartments);
  })
);

router.post(
  '/apartments',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { buildingId, number, price, status } = req.body;

    if (!buildingId || !number || price == null || !status) {
      return res.status(400).json({
        message: 'buildingId, number, price i status su obavezni'
      });
    }

    // Provera da li zgrada postoji (FK logika na nivou aplikacije)
    const building = await Building.findByPk(buildingId);
    if (!building) {
      return res.status(400).json({ message: 'Ne postoji zgrada sa datim buildingId' });
    }

    const apartment = await Apartment.create({
      buildingId,
      number,
      price,
      status
    });

    res.status(201).json(apartment);
  })
);

router.put(
  '/apartments/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { buildingId, number, price, status } = req.body;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({ message: 'Stan ne postoji' });
    }

    // Ako se menja buildingId, proveri da li zgrada postoji
    if (buildingId != null) {
      const building = await Building.findByPk(buildingId);
      if (!building) {
        return res.status(400).json({ message: 'Ne postoji zgrada sa datim buildingId' });
      }
      apartment.buildingId = buildingId;
    }

    apartment.number = number ?? apartment.number;
    apartment.price = price ?? apartment.price;
    apartment.status = status ?? apartment.status;

    await apartment.save();

    res.json(apartment);
  })
);

router.delete(
  '/apartments/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({ message: 'Stan ne postoji' });
    }

    await apartment.destroy();

    res.json({ message: 'Stan uspešno obrisan' });
  })
);


module.exports = router;