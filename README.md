# RoadSoS AI - Emergency Response Platform

A hackathon-winning MERN stack emergency response web application for road accident emergencies.

## Features

- **One-tap SOS** - Instant emergency access without login
- **Nearby Services** - Find hospitals, ambulances, police, towing services
- **Accident Reporting** - Witness mode for reporting incidents
- **Optional Authentication** - Save profile and emergency contacts
- **Offline Support** - localStorage caching for emergency data
- **Live Tracking** - Simulated ambulance tracking on map

## Tech Stack

- Frontend: React + Tailwind CSS + Vite
- Backend: Node.js + Express + MongoDB
- Maps: OpenStreetMap / Google Maps
- Optional AI: DeviceMotion API accident detection

## Setup

### Backend
```bash
cd backend
npm install
# Make sure MongoDB is running locally
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Backend `.env`:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLIENT_URL` - Frontend URL for CORS

Frontend `.env`:
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/:userId` - Get user profile
- `POST /api/incidents` - Report accident
- `POST /api/emergency/sos` - Trigger SOS
- `GET /api/contacts/user/:userId` - Get emergency contacts

## Design Principles

- **No login barriers** for emergency access
- **Mobile-first responsive** design
- **Minimal cognitive load** during emergencies
- **Glassmorphism UI** with emergency red theme
