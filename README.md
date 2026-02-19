# CPOOP – Community Pharmacies Online Ordering Platform

A Next.js + Firebase web app for finding community pharmacies, checking stock and placing orders.

## Features

- Product discovery: search by name, category and town
- Map view (Leaflet) to browse pharmacies by location
- Basket with stock-aware UI (prevents obviously invalid quantities)
- Transactional checkout (Firestore transaction) to prevent overselling
- Role-based areas: User / Pharmacy Admin / Super Admin

## Tech stack

- Next.js (App Router) + React
- Firebase Authentication
- Cloud Firestore
- Leaflet (map)

## Quick start

### Requirements

- Node.js 18+ (recommended)
- VSC IDE

### Unpack zip file - open project folder and install:

```bash
npm install
```

### Environment variables

This project uses Firebase client config via `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

(An example `.env.local` is included in this submission nut not in GitHub Repo.)

### Run

```bash
npm run dev
```

Open http://localhost:3000

## Demo accounts (for marking/testing)

All accounts use the same password: _available on request_

- Regular user: **user@gmail.com**
- Pharmacy Admin: **samir@pharmacist.co.uk**
- Super Admin: **lubiejewskidaniel@gmail.com**

## Notes

- Some pages/components are client-side due to state, context and browser-only libraries (e.g. Leaflet).
- A small “Featured products” page is included to demonstrate **React Server Components** and **Server Actions**.
