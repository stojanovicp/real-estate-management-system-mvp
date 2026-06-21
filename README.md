# Platforma za upravljanje ponudom stanova

Public apartment listing platform with an internal tool for managing inquiries and reservations.

Public users browse available buildings and apartments and submit inquiries. Authenticated internal users (Employee and Administrator) manage those inquiries and create reservations. The system enforces one active reservation per apartment and automatically keeps apartment status in sync with reservation changes.

---

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **ORM:** Sequelize (migrations + seeders)
- **Auth:** JWT (Bearer token)
- **External APIs:** OpenStreetMap / Leaflet (map), Frankfurter (EUR → RSD exchange rate)

---

## User Roles

| Role | Description |
|---|---|
| **Public User** | Not authenticated — browses buildings and apartments, views public prices, submits inquiries. |
| **Employee** | Authenticated — views and updates inquiry status, creates and manages reservations. |
| **Administrator** | Authenticated — all Employee permissions plus full CRUD on buildings, apartments, and internal user accounts. |

---

## Running Locally

### Backend

```bash
cd backend
cp .env.example .env   # then fill in your values
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend expects the backend at `http://localhost:4000` by default. Override with `REACT_APP_API_BASE_URL` in `frontend/.env` (not committed).

---

## Environment Variables

Create `backend/.env` based on `.env.example`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgres://user:pass@localhost:5432/iteh` |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Port for the backend server (default: `4000`) |

---

## Docker

Docker and Docker Compose support will be added in a later task.

---

## Authors

Petar Stojanović, Katarina Krneta, Nikola Todorović — FON, Internet tehnologije 2025
