import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-red-500/30 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BF</span>
          </div>
          <span className="text-white font-bold text-xl">
            Bug<span className="text-red-500">Flow</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-red-500 transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/new-scan"
            className="text-gray-300 hover:text-red-500 transition-colors font-medium"
          >
            New Scan
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-300 font-medium">
              {user?.username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg transition-all font-medium"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
