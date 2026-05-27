import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import SosPage from './pages/SosPage';
import NearbyServices from './pages/NearbyServices';
import ReportAccident from './pages/ReportAccident';
import Login from './pages/Login';
import Profile from './pages/Profile';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sos" element={<SosPage />} />
      <Route path="/services" element={<NearbyServices />} />
      <Route path="/report" element={<ReportAccident />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
);
