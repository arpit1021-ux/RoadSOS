import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 glass z-50 p-4 safe-area">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link to="/" className="text-emergency font-bold text-xl">RoadSoS AI</Link>
        <div className="flex space-x-4 text-sm">
          <Link to="/sos" className="text-gray-300 hover:text-white">SOS</Link>
          <Link to="/services" className="text-gray-300 hover:text-white">Services</Link>
          <Link to="/report" className="text-gray-300 hover:text-white">Report</Link>
          <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
}
