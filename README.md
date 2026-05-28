<div align="center">

<img src="https://img.shields.io/badge/RoadSoS-AI-FF1A1A?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA1IDktNVYtN2wtOSA1LTkgNXoiLz48L3N2Zz4=&logoColor=white" alt="RoadSoS AI" />

# 🚨 RoadSoS AI

### Intelligent Emergency Response System for Road Accidents

**One tap. Instant help. No barriers.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

> Built a solution. Designed for real life.

</div>

---

## 🎯 The Problem

Every minute counts in a road accident. Yet most people panic, waste precious time searching for numbers, or can't access help fast enough. In India alone, **over 1.5 lakh people die annually** in road accidents — many from delayed emergency response.

**RoadSoS AI solves this.** A single tap connects victims and witnesses to the nearest emergency services — no account, no form, no friction.

---

## ✨ Key Features

| Feature | Description |
|--------|-------------|
| 🚨 **One-Tap SOS** | Instantly fetches your GPS location and shows nearby emergency services — zero login required |
| 📍 **Nearby Services** | Live map of hospitals, ambulances, police stations, and tow services with ETA |
| 📝 **Witness Report Mode** | Separate flow for bystanders to report accident type and auto-route correct services |
| 🧠 **AI Triage Assistant** | Describes the situation in natural language and gets immediate first-aid guidance |
| 📊 **Severity Scoring** | Real-time 0–100 severity score based on accident type, injuries, weather, and time |
| 🗺️ **Dispatch Visualization** | Animated map showing emergency service routing from dispatch to accident site |
| 📡 **Offline Mode** | Critical numbers and last-known services cached via localStorage — works without internet |
| 🔐 **Optional Login** | Save blood group, medical notes, and emergency contacts for faster future alerts |
| 📱 **Mobile-First UI** | Large accessible buttons, glassmorphism design — optimized for panic situations |

---

## 🏗️ Architecture

```
roadsos-ai/
├── frontend/               # React + Vite + Tailwind
│   └── src/
│       ├── pages/          # Home, Nearby, Report, Dashboard, Login, Profile
│       ├── components/     # SOSButton, ServiceCard, EmergencyMap, Navbar
│       ├── context/        # AuthContext (JWT)
│       ├── hooks/          # useGeolocation, useAccidentDetection
│       └── utils/          # Axios API client
│
├── backend/                # Node.js + Express + MongoDB
│   ├── models/             # User, EmergencyContact, IncidentReport, EmergencyLog
│   ├── routes/             # auth, users, emergency, incidents, services
│   └── middleware/         # JWT auth (protect + optionalAuth)
│
└── ai-module/              # Severity analyzer + triage logic
    └── analyzer.py         # Accident severity scoring engine
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)
- Git

### 1. Clone the repo

```bash
git clone https://github.com/arpit1021-ux/RoadSOS.git
cd RoadSOS
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

App runs at → **http://localhost:5173**
API runs at → **http://localhost:5000**

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/roadsos-ai
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `PUT` | `/api/auth/profile` | ✅ | Update profile |

### Emergency *(No login required)*
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/emergency/sos` | Optional | Log SOS trigger with location |
| `GET` | `/api/services/nearby` | ❌ | Get nearby emergency services |
| `GET` | `/api/services/numbers` | ❌ | Get national emergency numbers |

### Incidents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/incidents` | Optional | Report an accident |
| `GET` | `/api/incidents/recent` | ❌ | Recent public incidents |
| `GET` | `/api/incidents/mine` | ✅ | My filed reports |

### Contacts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/` | ✅ | Get emergency contacts |
| `POST` | `/api/users/` | ✅ | Add contact |
| `DELETE` | `/api/users/:id` | ✅ | Remove contact |

---

## 🗄️ Database Models

```
User              → name, email, phone, bloodGroup, medicalNotes, emergencyContacts[]
EmergencyContact  → userId, name, phone, relationship, isPrimary
IncidentReport    → accidentType, severity, location{GeoJSON}, status, injuredPersons
EmergencyLog      → userId, type, location, timestamp (audit trail for every SOS)
```

---

## 🧠 AI Module

The `ai-module/analyzer.py` calculates a real-time **severity score (0–100)** based on:

- Accident type (collision, fire, hit-and-run, etc.)
- Number of injured persons
- Vehicles involved
- Time of day (night = higher risk)
- Weather conditions
- Location type (highway vs city road)

Output includes: severity label, recommended services to dispatch, estimated response time, risk factors, and immediate actions checklist.

---

## 🎨 Design Philosophy

RoadSoS AI is built around one core principle: **a frightened person should never face friction.**

- 🔴 Emergency red + dark UI — instantly communicates urgency
- 🔘 Oversized tap targets — usable with shaking hands
- ⚡ SOS works with zero login — fastest path to help
- 📶 Offline-first — last known data cached for poor connectivity
- 🧠 Minimal cognitive load — decisions guided, not dumped on the user

---

## 📱 User Flows

```
VICTIM FLOW
───────────
Open app → Tap SOS → Location fetched (< 3s) → Nearest services shown → Navigate / Call

WITNESS FLOW
────────────
Open app → Report Accident → Select type → Severity scored → Services auto-dispatched → Report saved

REGISTERED USER FLOW
─────────────────────
Login → Save blood group + contacts → Next SOS auto-attaches medical profile → Contacts notified
```

---

## 📞 Built-in Emergency Numbers (India)

| Service | Number |
|---------|--------|
| National Emergency | 112 |
| Ambulance | 108 |
| Police | 100 |
| Fire Brigade | 101 |
| Highway Patrol | 1033 |
| Blood Bank | 1910 |

---

## 🛣️ Roadmap

- [ ] Real ambulance API integration (NHA / state health APIs)
- [ ] SMS/WhatsApp alert to emergency contacts on SOS
- [ ] PWA with full service worker offline support
- [ ] Responder mode (off-duty doctors / first-aiders can volunteer)
- [ ] Multi-language support (Hindi, regional languages)
- [ ] Integration with VAHAN database for vehicle lookup

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

---

## 👥 Team

Built with ❤️ at Road Safety Hackathon 2026 by **Team CodeRed**

---

## 📄 License

MIT © 2025 CodeRed AI Team

---

<div align="center">

**If this saves even one life, it was worth building.**

⭐ Star this repo if you believe in the mission

</div>