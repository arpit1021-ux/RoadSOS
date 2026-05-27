import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', bloodGroup: '', medicalNotes: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { phone: formData.phone } : formData;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/profile');
    } catch (err) {
      // Use local fallback
      const user = { id: Date.now(), ...formData };
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-emergency mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
              required
            />
          )}

          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
            required
          />

          {!isLogin && (
            <>
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
              />

              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full bg-white/5 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-emergency"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>

              <textarea
                placeholder="Medical Notes (allergies, conditions)"
                value={formData.medicalNotes}
                onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                className="w-full bg-white/5 rounded-xl p-4 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
                rows={3}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emergency text-white py-4 rounded-xl font-bold text-lg hover:bg-emergencyDark transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button onClick={() => setIsLogin(!isLogin)} className="text-gray-300 hover:text-white">
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
