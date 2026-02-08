const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');
const { Inquiry, Apartment, Building, Reservation } = require('../../models');

router.get(
  '/inquiries',
  auth,
  requireRole(['owner', 'admin']),
  asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.findAll({
      include: {
        model: Apartment,
        as: 'apartment',
        required: false,
        attributes: ['id', 'number'],
        include: {
          model: Building,
          as: 'building',
          required: false,
          attributes: ['id', 'name']
        }
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(inquiries);
  })
);

router.get(
  '/reservations',
  auth,
  requireRole(['owner', 'admin']),
  asyncHandler(async (req, res) => {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Apartment,
          as: 'apartment',
          attributes: ['id', 'number'],
          include: {
            model: Building,
            as: 'building',
            attributes: ['id', 'name']
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reservations);
  })
);

// Owner: lista stanova
router.get(
  '/apartments',
  auth,
  requireRole(['owner', 'admin']),
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

// Owner: izmena stana (bez promene buildingId)
router.put(
  '/apartments/:id',
  auth,
  requireRole(['owner', 'admin']),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { number, floor, rooms, area, price, status } = req.body;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({ message: 'Stan ne postoji' });
    }

    // Menjaj samo ako je polje poslato (dozvoljava i null)
    if (number !== undefined) apartment.number = number;
    if (floor !== undefined) apartment.floor = floor;
    if (rooms !== undefined) apartment.rooms = rooms;
    if (area !== undefined) apartment.area = area;
    if (price !== undefined) apartment.price = price;

    if (status !== undefined) {
      // status je nullable; validiraj samo ako nije null
      if (status !== null) {
        const allowedApartmentStatuses = ['available', 'reserved', 'sold'];
        if (!allowedApartmentStatuses.includes(status)) {
          return res.status(400).json({ message: 'Neispravan status stana' });
        }
      }
      apartment.status = status; // prihvata i null
    }

    await apartment.save();
    res.json(apartment);
  })
);

module.exports = router;
