const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');
const { Inquiry, Apartment } = require('../../models');
const { Building } = require('../../models');


router.get('/test', auth, (req, res) => {
  res.json({
    message: 'Autorizovan pristup',
    user: req.user
  });
});

router.get('/inquiries', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nemate dozvolu' });
  }

  const inquiries = await Inquiry.findAll({
  include: {
    model: Apartment,
    as: 'apartment',
    attributes: ['id', 'number']
  },
  order: [['createdAt', 'DESC']]
});

  res.json(inquiries);
}));

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

module.exports = router;