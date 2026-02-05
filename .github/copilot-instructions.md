<!-- .github/copilot-instructions.md - Guidance for coding agents in this repo -->
# Copilot / AI Agent Instructions — backend

Purpose: quickly orient an AI coding agent to the backend service so it can make safe, consistent edits.

- Quick start
  - Install deps: `cd backend && npm install`
  - Run in dev: `npm run dev` (uses `nodemon src/app.js`)
  - Run production-like: `npm run start` (runs `node src/app.js`)
  - DB management (uses `sequelize-cli`):
    - Create DB: `npx sequelize-cli db:create`
    - Run migrations: `npx sequelize-cli db:migrate`
    - Seed data: `npx sequelize-cli db:seed:all`

- Big picture (what to edit and why)
  - This repo contains a minimal Express + Sequelize backend:
    - HTTP server: [backend/src/app.js](backend/src/app.js#L1-L50) — central app, mounts middleware and routes.
    - ORM bootstrap: [backend/models/index.js](backend/models/index.js#L1-L100) — auto-loads model files and initializes Sequelize.
    - DB config: [backend/config/config.json](backend/config/config.json#L1-L40) — Sequelize environments (`development`, `test`, `production`).
    - CLI assets: `backend/migrations` and `backend/seeders` (empty currently) used by `sequelize-cli`.

- Key patterns & conventions (do not invent alternatives)
  - Models: expected to be CommonJS modules that export a function `(sequelize, DataTypes) => Model`. `models/index.js` calls that signature and then runs `.associate(db)` if present.
  - Environment: `NODE_ENV` controls which section of `config/config.json` is used. `models/index.js` also supports `use_env_variable` entries that point to an env var containing the full DB URL.
  - Project `package.json` (`backend/package.json`) uses `type: "commonjs"`. Keep to CommonJS require/exports in backend code.
  - Port and start behavior: `backend/src/app.js` reads `process.env.PORT || 4000`. Use `npm run dev` for autoreload during edits.

- Integration & infra details discovered
  - DB: PostgreSQL expected; `config/config.json` sets host `127.0.0.1` and port `5434` and default DB names `iteh_mvp*` across envs. Ensure a local Postgres instance or CI provides a DB at that port, or update config to use environment variables.
  - `dotenv` is a dependency; repository currently keeps DB credentials in `config/config.json`. Prefer `use_env_variable` or `.env` for secrets in deployments.

- How to add a new API endpoint or model (concrete steps)
  1. Add a model file under `backend/models/` exporting `(sequelize, DataTypes) => {...}` and optionally define `associate(db)`.
  2. Optionally add a migration in `backend/migrations/` and run `npx sequelize-cli db:migrate`.
  3. Add a router file under `backend/src/` (e.g., `src/routes/myResource.js`) that exports an Express router.
  4. Mount the router in `backend/src/app.js` with `app.use('/api/my-resource', require('./routes/myResource'))`.

- Debugging tips (project-specific)
  - Start with `npm run dev` to see server startup logs. Connection errors to Postgres will occur when `models/index.js` initializes Sequelize — check the console.
  - If DB credentials are missing, either set `NODE_ENV` to `development` or set `use_env_variable` in `config/config.json` and export the corresponding environment variable.

- What is not present / tests
  - There are no automated tests or model files yet. Be conservative when adding migrations that alter schema; migrations are irreversible unless explicitly written to rollback.

- Safe edit rules for an AI agent (short)
  - Do not change `type: "commonjs"` in `backend/package.json` unless migrating entire backend to ESM.
  - When adding credentials, prefer `use_env_variable` or `.env` and avoid committing secrets to `config/config.json`.
  - Keep routes under `src/` and models under `models/` — follow existing folder separation.

If anything here is unclear or you want examples added (e.g., a sample model + migration + route), tell me where you'd like the example and I will add it.
