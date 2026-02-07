const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email i lozinka su obavezni' });
  }

  const user = await User.findOne({ where: { email, isActive: true } });
  if (!user) {
    return res.status(401).json({ message: 'Pogrešni kredencijali' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Pogrešni kredencijali' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '1h' }
  );

  res.json({ token });
}));

router.post('/logout', (req, res) => {
  res.json({ message: 'Odjavljeni ste' });
});

router.post('/register', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nemate dozvolu' });
  }

  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Sva polja su obavezna' });
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: 'Korisnik već postoji' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    role,
    isActive: true
  });

  res.status(201).json({ id: user.id, email: user.email, role: user.role });
}));

module.exports = router;