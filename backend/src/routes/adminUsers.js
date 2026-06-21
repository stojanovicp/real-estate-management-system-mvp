'use strict';

const express = require('express');
const { User } = require('../../models');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

// GET /api/admin/users
router.get(
  '/users',
  auth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  })
);

// PATCH /api/admin/users/:id
router.patch(
  '/users/:id',
  auth,
  requireRole('ADMIN'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Korisnik nije pronađen' });
    }

    if (role !== undefined) {
      const allowedRoles = ['EMPLOYEE', 'ADMIN'];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: 'Neispravna uloga. Dozvoljeno: EMPLOYEE, ADMIN' });
      }
      user.role = role;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (isActive !== undefined) user.isActive = Boolean(isActive);

    await user.save();

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  })
);

module.exports = router;
