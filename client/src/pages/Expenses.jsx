import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    date: '',
    paymentMethod: '',
    notes: '',
  });

  const [filters, setFilters] = useState({
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.paymentMethod) params.paymentMethod = filters.paymentMethod;
      if (filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
      }

      const res = await axios.get('/expenses', { params });
      const filtered = filters.search
        ? res.data.filter((e) =>
            e.notes?.toLowerCase().includes(filters.search.toLowerCase())
          )
        : res.data;

      setExpenses(filtered);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/expenses/${editingId}`, newExpense);
        setEditingId(null);
      } else {
        await axios.post('/expenses', newExpense);
      }
      setNewExpense({ amount: '', category: '', date: '', paymentMethod: '', notes: '' });
      fetchExpenses();
    } catch (err) {
      console.log(err.mess);
      
      alert('Error saving expense');
    }
  };

  const handleEdit = (e) => {
    setNewExpense({
      amount: e.amount,
      category: e.category,
      date: e.date.split('T')[0],
      paymentMethod: e.paymentMethod,
      notes: e.notes || '',
    });
    setEditingId(e._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axios.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (err) {
      console.log(err.message);
      alert('Error deleting expense');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          {editingId ? 'Edit Expense' : 'Add Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-md p-4 grid md:grid-cols-3 gap-4 mb-6">
          <input type="number" name="amount" value={newExpense.amount} onChange={handleChange} placeholder="Amount" className="p-2 border rounded" required />
          <select name="category" value={newExpense.category} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
          <input type="date" name="date" value={newExpense.date} onChange={handleChange} className="p-2 border rounded" required />
          <select name="paymentMethod" value={newExpense.paymentMethod} onChange={handleChange} className="p-2 border rounded" required>
            <option value="">Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          <input type="text" name="notes" value={newExpense.notes} onChange={handleChange} placeholder="Notes" className="p-2 border rounded col-span-2 md:col-span-1" />
          <button type="submit" className="bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition col-span-full md:col-span-1 py-2">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>

        <form onSubmit={handleFilterSubmit} className="bg-white rounded-md shadow-md p-4 grid md:grid-cols-6 gap-4 mb-6">
          <select name="category" onChange={handleFilterChange} value={filters.category} className="p-2 border rounded">
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
            <option value="Health">Health</option>
            <option value="Other">Other</option>
          </select>
          <select name="paymentMethod" onChange={handleFilterChange} value={filters.paymentMethod} className="p-2 border rounded">
            <option value="">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </select>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="p-2 border rounded" />
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="p-2 border rounded" />
          <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search notes" className="p-2 border rounded" />
          <button type="submit" className="bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition py-2">
            Filter
          </button>
        </form>

        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Expenses</h2>

        {loading ? (
          <p>Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">No expenses found.</p>
        ) : (
          <ul className="space-y-4">
            {expenses.map((e) => (
              <li key={e._id} className="bg-white border rounded-md shadow-sm p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{e.amount} • {e.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(e.date).toLocaleDateString()} • {e.paymentMethod}
                    </p>
                    {e.notes && <p className="text-sm text-gray-600 mt-1 italic">"{e.notes}"</p>}
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => handleEdit(e)} className="bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 rounded hover:bg-blue-200">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(e._id)} className="bg-red-100 text-red-700 border border-red-300 px-3 py-1 rounded hover:bg-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
