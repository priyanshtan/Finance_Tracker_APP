import { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#FF6F91'];

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert('Error loading dashboard');
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Total Spent</h2>
          <p className="text-2xl font-bold text-green-700">₹{data.totalSpent}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Top Category</h2>
          <p className="text-lg font-medium">{data.topCategory || 'N/A'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500 text-sm">Top Payment Methods</h2>
          <ul className="list-disc ml-5 text-sm">
            {data.topPayments.length > 0 ? data.topPayments.map((method, idx) => (
              <li key={idx}>{method}</li>
            )) : <li>N/A</li>}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category-wise Spending Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-semibold mb-2">Category-wise Spending</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.categoryChart}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.categoryChart.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Spending Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-md font-semibold mb-2">Daily Spending Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.lineChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
