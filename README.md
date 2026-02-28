# Real Estate CRM

Full-stack web platform for public apartment listing and internal sales management.

The system enables public users to browse available apartments and send inquiries, while authenticated users (Owner/Admin) manage leads, reservations and payments through an internal CRM module.

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- REST API communication (JSON)

### Backend
- Node.js
- Express
- Role-based access control (RBAC)
- RESTful architecture

### Database
- PostgreSQL
- Relational data model with foreign keys and constraints

---

## Core Features

### Public Module
- Browse buildings and apartments
- Apartment filtering (floor, rooms, status)
- Apartment details page
- Controlled price visibility ("price on request")
- Inquiry submission (linked to apartment or general)
- Clickable building floor plan (image zone mapping)

### Internal CRM Module (Admin / Owner)
- Authentication & authorization
- Lead (customer) management
- Reservation management (one active reservation per apartment)
- Payment tracking
- Automatic apartment status updates (Available / Reserved / Sold)
- Debt calculation per reservation

---

## Architecture

Frontend and backend are separated and communicate via REST API (JSON over HTTPS).

- React handles UI rendering and routing.
- Express handles business logic, validation and authorization.
- PostgreSQL enforces data integrity (foreign keys, unique constraints).

---

## Business Rules

- One active reservation per apartment.
- Apartment automatically becomes:
  - **Reserved** when reservation is created.
  - **Sold** when first valid payment is recorded.
- Customer is auto-created or linked on inquiry submission (by email).

---

## Roles

| Role         | Permissions |
|-------------|------------|
| Public User | View listings, send inquiry |
| Owner       | Manage leads, reservations, payments |
| Admin       | Full access + manage buildings/apartments/floor plans |

---

## Project Structure

```
backend/
  models/
  routes/
  controllers/
  middleware/
  migrations/

frontend/
  pages/
  components/
  api/
  auth/
```

---

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Author

Petar Stojanović