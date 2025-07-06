import { useEffect, useState } from 'react';
import axios from '../api/axios';

const CATEGORY_OPTIONS = ['Food', 'Rent', 'Shopping', 'Travel', 'Health', 'Other'];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState({ category: '', limit: '' });

  const fetchBudgets = async () => {
    const res = await axios.get('/budgets');
    setBudgets(res.data);
  };

  const fetchAlerts = async () => {
    const res = await axios.get('/budgets/alerts');
    setAlerts(res.data);
  };

  useEffect(() => {
    fetchBudgets();
    fetchAlerts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/budgets', form);
      setForm({ category: '', limit: '' });
      fetchBudgets();
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert('Error setting budget');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧮 Manage Budgets</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow grid gap-4 mb-6">
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="p-2 border"
        >
          <option value="">Select Category</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Monthly Limit (₹)"
          value={form.limit}
          onChange={e => setForm({ ...form, limit: e.target.value })}
          required
          className="p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Set / Update Budget
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-2">Your Budgets</h2>
      {budgets.length === 0 ? (
        <p className="text-gray-500">No budgets set yet.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {budgets.map((b) => (
            <li key={b._id} className="p-3 flex justify-between">
              <span>{b.category}</span>
              <span className="text-green-700 font-semibold">₹{b.limit}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-lg font-semibold mt-8 mb-2">🚨 Budget Alerts</h2>
      {alerts.length === 0 ? (
        <p className="text-gray-500">No alerts this month.</p>
      ) : (
        <ul className="bg-white rounded shadow divide-y">
          {alerts.map((a, i) => (
            <li key={i} className="p-3 flex justify-between">
              <div>
                <strong>{a.category}</strong> - Spent ₹{a.spent} / ₹{a.limit}
              </div>
              <span className={`font-semibold ${a.alert === 'Limit Exceeded' ? 'text-red-600' : 'text-orange-500'}`}>
                {a.alert}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
