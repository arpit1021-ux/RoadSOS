// Offline Emergency Support
export const cacheCriticalData = () => {
  const criticalData = {
    emergencyNumbers: {
      police: '911',
      ambulance: '911',
      fire: '911'
    },
    lastLocation: localStorage.getItem('lastLocation'),
    lastSOS: localStorage.getItem('lastSOS')
  };
  localStorage.setItem('cachedEmergencyData', JSON.stringify(criticalData));
};

export const getCachedEmergencyData = () => {
  const cached = localStorage.getItem('cachedEmergencyData');
  return cached ? JSON.parse(cached) : null;
};

export const isOnline = () => navigator.onLine;
