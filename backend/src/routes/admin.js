const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');
const { Inquiry, Apartment, Building, Reservation } = require('../../models');

// -------------------- INQUIRIES (READ) --------------------
router.get(
  '/inquiries',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.findAll({
      include: {
        model: Apartment,
        as: 'apartment',
        required: false,
        attributes: ['id', 'number']
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(inquiries);
  })
);

// -------------------- BUILDINGS --------------------
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

    // Po zahtevu: nullable polja nisu obavezna; ako nisu poslata -> null
    const building = await Building.create({
      name: name ?? null,
      address: address ?? null
    });

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

    // Menjaj samo ako je poslato (dozvoljava i null)
    if (name !== undefined) building.name = name;
    if (address !== undefined) building.address = address;

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

    try {
      await building.destroy();
      return res.json({ message: 'Zgrada uspešno obrisana' });
    } catch (err) {
      // FK RESTRICT: ne može obrisati building dok postoje apartments
      if (err?.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          message: 'Ne možete obrisati zgradu dok postoje stanovi u njoj'
        });
      }
      throw err;
    }
  })
);

// -------------------- APARTMENTS --------------------
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
    const { buildingId, number, floor, rooms, area, price, status } = req.body;

    // buildingId je NOT NULL u bazi
    if (!buildingId) {
      return res.status(400).json({ message: 'buildingId je obavezan' });
    }

    // Provera FK (building mora postojati)
    const building = await Building.findByPk(buildingId);
    if (!building) {
      return res.status(400).json({ message: 'Ne postoji zgrada sa datim buildingId' });
    }

    // status je nullable, ali ako je poslat i nije null -> mora biti validan
    if (status !== undefined && status !== null) {
      const allowedApartmentStatuses = ['available', 'reserved', 'sold'];
      if (!allowedApartmentStatuses.includes(status)) {
        return res.status(400).json({ message: 'Neispravan status stana' });
      }
    }

    const apartment = await Apartment.create({
      buildingId,
      number: number ?? null,
      floor: floor ?? null,
      rooms: rooms ?? null,
      area: area ?? null,
      price: price ?? null,
      status: status ?? null
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
    const { buildingId, number, floor, rooms, area, price, status } = req.body;

    const apartment = await Apartment.findByPk(id);
    if (!apartment) {
      return res.status(404).json({ message: 'Stan ne postoji' });
    }

    // buildingId: ako je poslat, ne sme biti null (NOT NULL u bazi)
    if (buildingId !== undefined) {
      if (buildingId === null) {
        return res.status(400).json({ message: 'buildingId ne može biti null' });
      }
      const building = await Building.findByPk(buildingId);
      if (!building) {
        return res.status(400).json({ message: 'Ne postoji zgrada sa datim buildingId' });
      }
      apartment.buildingId = buildingId;
    }

    // Ostala polja su nullable -> menjaj samo ako su poslata (dozvoljava i null)
    if (number !== undefined) apartment.number = number;
    if (floor !== undefined) apartment.floor = floor;
    if (rooms !== undefined) apartment.rooms = rooms;
    if (area !== undefined) apartment.area = area;
    if (price !== undefined) apartment.price = price;

    if (status !== undefined) {
      if (status !== null) {
        const allowedApartmentStatuses = ['available', 'reserved', 'sold'];
        if (!allowedApartmentStatuses.includes(status)) {
          return res.status(400).json({ message: 'Neispravan status stana' });
        }
      }
      apartment.status = status;
    }

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

    try {
      await apartment.destroy();
      return res.json({ message: 'Stan uspešno obrisan' });
    } catch (err) {
      // FK RESTRICT: ne može obrisati apartment dok postoje reservations
      if (err?.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(409).json({
          message: 'Ne možete obrisati stan dok postoje rezervacije za njega'
        });
      }
      throw err;
    }
  })
);

// -------------------- RESERVATIONS --------------------
router.get(
  '/reservations',
  auth,
  requireRole('admin'),
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

router.post(
  '/reservations',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { apartmentId, startDate, endDate, status } = req.body;

    // apartmentId je NOT NULL u bazi
    if (!apartmentId) {
      return res.status(400).json({ message: 'apartmentId je obavezan' });
    }

    const apartment = await Apartment.findByPk(apartmentId);
    if (!apartment) {
      return res.status(400).json({ message: 'Stan ne postoji' });
    }

    // status je nullable, ali ako je poslat i nije null -> validiraj
    if (status !== undefined && status !== null) {
      const allowedReservationStatuses = ['active', 'canceled', 'expired'];
      if (!allowedReservationStatuses.includes(status)) {
        return res.status(400).json({ message: 'Neispravan status rezervacije' });
      }
    }

    // zabrana vise aktivnih rezervacija za isti stan (samo ako se eksplicitno pravi active)
    if (status === 'active') {
      const existingActive = await Reservation.findOne({
        where: { apartmentId, status: 'active' }
      });

      if (existingActive) {
        return res.status(409).json({
          message: 'Vec postoji aktivna rezervacija za ovaj stan'
        });
      }
    }

    const reservation = await Reservation.create({
      apartmentId,
      startDate: startDate ?? null,
      endDate: endDate ?? null,
      status: status ?? null
    });

    res.status(201).json(reservation);
  })
);

router.put(
  '/reservations/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Rezervacija ne postoji' });
    }

    // nullable -> menjaj samo ako je poslato
    if (startDate !== undefined) reservation.startDate = startDate;
    if (endDate !== undefined) reservation.endDate = endDate;

    if (status !== undefined) {
      if (status !== null) {
        const allowedReservationStatuses = ['active', 'canceled', 'expired'];
        if (!allowedReservationStatuses.includes(status)) {
          return res.status(400).json({ message: 'Neispravan status rezervacije' });
        }
      }

      // zabrana da vise rezervacija za isti stan bude aktivno
      if (status === 'active' && reservation.status !== 'active') {
        const existingActive = await Reservation.findOne({
          where: { apartmentId: reservation.apartmentId, status: 'active' }
        });

        if (existingActive) {
          return res.status(409).json({
            message: 'Vec postoji aktivna rezervacija za ovaj stan'
          });
        }
      }

      reservation.status = status;
    }

    await reservation.save();
    res.json(reservation);
  })
);

router.delete(
  '/reservations/:id',
  auth,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Rezervacija ne postoji' });
    }

    await reservation.destroy();
    res.json({ message: 'Rezervacija uspešno obrisana' });
  })
);

module.exports = router;
