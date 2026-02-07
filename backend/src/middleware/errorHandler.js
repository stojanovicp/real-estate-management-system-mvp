module.exports = (err, req, res, next) => {
  // Minimalno logovanje (da vidiš stack u konzoli)
  console.error(err);

  // Ako je već poslato nešto klijentu, prepusti Express-u
  if (res.headersSent) return next(err);

  // Sequelize tipične greške (validacija, unique constraint)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Neispravni podaci',
      details: err.errors?.map(e => e.message) ?? []
    });
  }

  return res.status(500).json({ message: 'Interna greška servera' });
};
