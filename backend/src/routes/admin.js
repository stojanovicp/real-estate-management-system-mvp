const express = require('express');
const auth = require('../middleware/auth');
const { Inquiry, Apartment } = require('../../models');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

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


module.exports = router;