import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCIDENT_TYPES = [
  { id: 'major_collision', label: 'Major Collision', emoji: '💥', color: 'bg-red-600' },
  { id: 'vehicle_breakdown', label: 'Vehicle Breakdown', emoji: '🚗', color: 'bg-amber-600' },
  { id: 'fire', label: 'Fire', emoji: '🔥', color: 'bg-orange-600' },
  { id: 'hit_and_run', label: 'Hit and Run', emoji: '🏃', color: 'bg-purple-600' },
  { id: 'road_blockage', label: 'Road Blockage', emoji: '🚧', color: 'bg-blue-600' }
];

export default function ReportAccident() {
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleReport = async () => {
    if (!selectedType) return;
    
    setSubmitting(true);
    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const location = {
        type: 'Point',
        coordinates: [pos.coords.longitude, pos.coords.latitude]
      };
      
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/incidents`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: selectedType,
            location,
            description,
            reportedBy: 'witness'
          })
        });
      } catch (err) {
        // Continue even if API fails
      } finally {
        navigate('/');
      }
    });
  };

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="glass rounded-3xl p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-emergency mb-2">📝 Report Accident</h1>
        <p className="text-gray-300">Witness assistance mode - Help others in need</p>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Select Accident Type</h2>
        <div className="grid grid-cols-1 gap-3">
          {ACCIDENT_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`glass rounded-xl p-4 text-left transition-all ${selectedType === type.id ? 'ring-2 ring-emergency' : ''}`}
            >
              <div className="flex items-center">
                <span className="text-3xl mr-4">{type.emoji}</span>
                <span className="text-lg font-semibold">{type.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Additional Details (Optional)</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the incident..."
          className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
          rows={4}
        />
      </div>

      <button
        onClick={handleReport}
        disabled={!selectedType || submitting}
        className="w-full bg-emergency text-white py-4 rounded-2xl font-bold text-xl disabled:opacity-50 hover:bg-emergencyDark transition-colors"
      >
        {submitting ? 'Reporting...' : 'Submit Report'}
      </button>
    </div>
  );
}
