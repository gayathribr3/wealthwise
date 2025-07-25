import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BsClipboardData, // Icon for Recommendation
  BsWallet2,         // Icon for Investable Amount
  BsGraphUpArrow,    // Icon for Return
} from 'react-icons/bs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  console.log("1. Dashboard component is rendering.");
   // State to hold the data from the API
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("2. useEffect hook has started.");
    const fetchRecommendation = async () => {
      try {
        console.log("3. Trying to get token from localStorage...");
        // Get the auth token from localStorage
        const token = localStorage.getItem('token');

        // Let's see what the token is, or if it's missing.
        console.log("4. Token found in localStorage:", token);

        if (!token) {
           console.error("5. No token found! Stopping the fetch process.");
          setError('No authentication token found. Please log in.');
          setLoading(false);
          return;
        }

        // Prepare the request headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch data from your Node.js backend
        // Corrected the URL to match your backend route setup
         console.log("6. Token exists. Sending network request to backend...");
        const response = await axios.get('http://localhost:5000/api/investment/recommendation', config);

        console.log("7. Network request successful. Response:", response.data);
        setRecommendation(response.data);

      } catch (err) {
        console.error("8. An error occurred during the API call:", err);
        setError(err.response?.data?.message || 'Failed to fetch investment recommendation.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, []);

  // Prepare data for the charts once the recommendation is loaded
  const chartData = recommendation
    ? Object.keys(recommendation.allocations).map((key) => ({
        name: key,
        value: recommendation.allocations[key] * 100, // Convert to percentage
      }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Handle loading and error states
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-white text-2xl">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-400 text-2xl">{error}</div>;
  }

  return (
     <main className="bg-[#1e293b] text-[#e2e8f0] font-sans min-h-screen p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl text-white tracking-wider font-bold">YOUR PERSONALIZED DASHBOARD</h3>
      </div>

      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <div className="bg-slate-700 p-4 rounded-md flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-slate-300 tracking-wider font-semibold">AI RECOMMENDATION</h3>
            <BsClipboardData className="text-2xl text-cyan-400" />
          </div>
          <p className="text-sm text-slate-400 mt-2">{recommendation?.explanation}</p>
        </div>

        <div className="bg-slate-700 p-4 rounded-md flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-slate-300 tracking-wider font-semibold">MONTHLY INVESTABLE</h3>
            <BsWallet2 className="text-2xl text-green-400" />
          </div>
          <h1 className="text-3xl text-white font-bold mt-2">
            ₹{recommendation?.monthly_investable_inr.toLocaleString('en-IN')}
          </h1>
        </div>

        <div className="bg-slate-700 p-4 rounded-md flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg text-slate-300 tracking-wider font-semibold">EXPECTED RETURN (p.a.)</h3>
            <BsGraphUpArrow className="text-2xl text-amber-400" />
          </div>
          <h1 className="text-3xl text-white font-bold mt-2">{recommendation?.expected_annual_return_pct}%</h1>
        </div>
      </div>

      {/* Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
        <div className="w-full h-full bg-slate-800 p-4 rounded-md shadow-lg">
          <h4 className="text-center font-bold mb-4">Allocation Details</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
              <YAxis unit="%" tick={{ fill: '#94a3b8' }} />
              <Tooltip
                cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Legend />
              <Bar dataKey="value" name="Allocation %" fill="#2dd4bf" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-full bg-slate-800 p-4 rounded-md shadow-lg">
          <h4 className="text-center font-bold mb-4">Allocation Overview</h4>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(0)}%`}
                contentStyle={{ backgroundColor: '#cedbf0ff', border: '1px solid #334155' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  )
};

export default Dashboard;



