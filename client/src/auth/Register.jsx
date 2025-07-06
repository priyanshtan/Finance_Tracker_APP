import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Email may already exist.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Register for Finance Tracker</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account? <a href="/login" className="text-green-600 underline">Login</a>
        </p>
      </div>
    </div>
  );
}
