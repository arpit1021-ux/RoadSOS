import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    const storedContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '[]');
    setContacts(storedContacts);
  }, [navigate]);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return;
    const updated = [...contacts, { ...newContact, id: Date.now() }];
    setContacts(updated);
    localStorage.setItem('emergencyContacts', JSON.stringify(updated));
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  const callContact = (phone) => window.open(`tel:${phone}`);

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="glass rounded-3xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-emergency mb-4">👤 Profile</h1>
        <div className="space-y-2">
          <p><span className="text-gray-400">Name:</span> {user.name}</p>
          <p><span className="text-gray-400">Phone:</span> {user.phone}</p>
          {user.bloodGroup && <p><span className="text-gray-400">Blood Group:</span> {user.bloodGroup}</p>}
          {user.medicalNotes && <p><span className="text-gray-400">Medical Notes:</span> {user.medicalNotes}</p>}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-emergency mb-4">Emergency Contacts</h2>
        {contacts.length > 0 && (
          <div className="space-y-3 mb-4">
            {contacts.map((c) => (
              <div key={c.id} className="glass rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-400">{c.relationship} • {c.phone}</p>
                </div>
                <button onClick={() => callContact(c.phone)} className="bg-emergency text-white px-4 py-2 rounded-lg font-bold">
                  Call
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
          />
          <input
            type="text"
            placeholder="Relationship"
            value={newContact.relationship}
            onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
            className="w-full bg-white/5 rounded-xl p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-emergency"
          />
          <button onClick={addContact} className="w-full bg-emergency text-white py-3 rounded-xl font-bold hover:bg-emergencyDark">
            Add Contact
          </button>
        </div>
      </div>

      <button
        onClick={() => { localStorage.clear(); navigate('/'); }}
        className="w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20"
      >
        Logout
      </button>
    </div>
  );
}
