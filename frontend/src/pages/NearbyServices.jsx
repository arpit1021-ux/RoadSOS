import { useState, useEffect } from 'react';

export default function NearbyServices() {
  const [services, setServices] = useState(getDummyServices());
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  const getDummyServices = () => ({
    hospitals: [
      { id: 1, name: 'City General Hospital', distance: '2.3 km', eta: '5 mins', phone: '911', type: 'hospital' },
      { id: 2, name: 'County Trauma Center', distance: '3.1 km', eta: '7 mins', phone: '911', type: 'hospital' },
      { id: 3, name: 'St. Mary Medical', distance: '4.5 km', eta: '10 mins', phone: '911', type: 'hospital' }
    ],
    ambulances: [
      { id: 1, name: 'EMS Ambulance #1', distance: '1.5 km', eta: '4 mins', phone: '911', type: 'ambulance' },
      { id: 2, name: 'Rapid Response Ambulance', distance: '2.8 km', eta: '6 mins', phone: '911', type: 'ambulance' }
    ],
    police: [
      { id: 1, name: 'Police Station Downtown', distance: '1.2 km', eta: '3 mins', phone: '911', type: 'police' },
      { id: 2, name: 'Highway Patrol', distance: '5.2 km', eta: '12 mins', phone: '911', type: 'police' }
    ],
    towing: [
      { id: 1, name: 'Quick Tow Services', distance: '4.1 km', eta: '8 mins', phone: '911', type: 'towing' },
      { id: 2, name: 'Highway Recovery', distance: '6.3 km', eta: '15 mins', phone: '911', type: 'towing' }
    ]
  });

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="glass rounded-3xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-emergency mb-2">📍 Nearby Emergency Services</h1>
        <p className="text-gray-300">
          {location ? `Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Fetching location...'}
        </p>
      </div>

      <ServiceSection title="🏥 Hospitals" services={services.hospitals} />
      <ServiceSection title="🚑 Ambulance Services" services={services.ambulances} />
      <ServiceSection title="🚓 Police Stations" services={services.police} />
      <ServiceSection title="🚛 Towing Services" services={services.towing} />
    </div>
  );
}

function ServiceSection({ title, services }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div className={`glass rounded-3xl p-6 mb-6 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
      {services.map((s) => (
        <div key={s.id} className="glass rounded-xl p-4 mb-3 hover:bg-white/5 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg">{s.name}</p>
              <p className="text-sm text-gray-400">{s.distance} • Estimated arrival: {s.eta}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.open(`tel:${s.phone}`)} 
                className="bg-emergency text-white px-4 py-2 rounded-lg font-bold hover:bg-emergencyDark transition-colors"
              >
                Call
              </button>
              <button 
                onClick={() => window.open(`https://maps.google.com/?q=${s.name}`, '_blank')} 
                className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Navigate
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
