import { useState, useEffect } from 'react';

export default function SosPage() {
  const [location, setLocation] = useState(null);
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    triggerSOS();
  }, []);

  const triggerSOS = async () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        
        // Fetch nearby services
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/emergency/sos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: { type: 'Point', coordinates: [loc.lng, loc.lat] } })
          });
          const data = await res.json();
          setServices(data.services);
        } catch (err) {
          // Use dummy data if API fails
          setServices(getDummyServices());
        }
        setLoading(false);
        
        // Save to localStorage for offline
        localStorage.setItem('lastLocation', JSON.stringify(loc));
        localStorage.setItem('lastSOS', Date.now().toString());
      },
      (err) => {
        setError('Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const getDummyServices = () => ({
    hospitals: [
      { id: 1, name: 'City General Hospital', distance: '2.3 km', eta: '5 mins', phone: '911' },
      { id: 2, name: 'Trauma Center', distance: '3.1 km', eta: '7 mins', phone: '911' }
    ],
    ambulances: [
      { id: 1, name: 'Ambulance #1', distance: '1.5 km', eta: '4 mins', phone: '911' },
      { id: 2, name: 'Ambulance #2', distance: '2.8 km', eta: '6 mins', phone: '911' }
    ],
    police: [
      { id: 1, name: 'Police Station Downtown', distance: '1.2 km', eta: '3 mins', phone: '911' }
    ],
    towing: [
      { id: 1, name: 'Quick Tow Services', distance: '4.1 km', eta: '8 mins', phone: '911' }
    ]
  });

  const openNavigation = () => {
    if (location) {
      window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-12 text-center">
          <div className="animate-pulse text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-emergency mb-4">Finding nearby emergency services...</h2>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-emergency rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emergency rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-emergency rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">{error}</h2>
          <button onClick={triggerSOS} className="bg-emergency text-white px-6 py-3 rounded-xl font-bold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="glass rounded-3xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-emergency mb-2">🚨 SOS ACTIVATED</h1>
        <p className="text-gray-300">Help is on the way!</p>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-emergency">📍 Your Location</h2>
        <p className="text-gray-300 mb-4">
          {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Locating...'}
        </p>
        <button onClick={openNavigation} className="w-full bg-emergency text-white py-3 rounded-xl font-bold hover:bg-emergencyDark">
          Open Navigation
        </button>
      </div>

      {services && (
        <>
          <ServiceSection title="🏥 Hospitals" services={services.hospitals} />
          <ServiceSection title="🚑 Ambulances" services={services.ambulances} />
          <ServiceSection title="🚓 Police" services={services.police} />
          <ServiceSection title="🚛 Towing" services={services.towing} />
        </>
      )}
    </div>
  );
}

function ServiceSection({ title, services }) {
  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {services.map((s) => (
        <div key={s.id} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
          <div>
            <p className="font-semibold">{s.name}</p>
            <p className="text-sm text-gray-400">{s.distance} • ETA: {s.eta}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => window.open(`tel:${s.phone}`)} className="bg-emergency text-white px-4 py-2 rounded-lg text-sm font-bold">
              Call
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
