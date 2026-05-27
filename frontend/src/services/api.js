const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  getNearbyServices: async (lat, lng) => {
    const res = await fetch(`${API_URL}/api/emergency/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location: { type: 'Point', coordinates: [lng, lat] } })
    });
    return res.json();
  },

  triggerSOS: async (location, userId) => {
    const res = await fetch(`${API_URL}/api/emergency/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, userId })
    });
    return res.json();
  },

  reportIncident: async (data) => {
    const res = await fetch(`${API_URL}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  login: async (phone, email) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  }
};
