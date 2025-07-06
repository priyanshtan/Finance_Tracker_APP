import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        💰 Finance Tracker+
      </Link>

      {token ? (
        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/expenses" className="text-gray-700 hover:text-blue-600">Expenses</Link>
          <Link to="/budgets" className="text-gray-700 hover:text-blue-600">Budgets</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
        </div>
      )}
    </nav>
  );
}
