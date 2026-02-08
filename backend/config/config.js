require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL nije definisan. Proveri .env u root folderu.');
}

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
