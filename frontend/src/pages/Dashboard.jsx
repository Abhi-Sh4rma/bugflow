import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { scansAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await scansAPI.getAll();
      setScans(response.data);
    } catch (error) {
      toast.error('Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: scans.length,
    completed: scans.filter(s => s.status === 'completed').length,
    running: scans.filter(s => s.status === 'running').length,
    high: scans.reduce((acc, s) => acc + (s.high_count || 0), 0),
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'running': return 'text-yellow-400 bg-yellow-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl">
            Welcome back, <span className="text-red-500">{user?.username}</span>! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here's your bug bounty hunting overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-medium">Total Scans</p>
            <p className="text-white text-3xl font-bold mt-2">{stats.total}</p>
            <p className="text-gray-500 text-sm mt-1">All time</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-medium">Completed</p>
            <p className="text-green-400 text-3xl font-bold mt-2">{stats.completed}</p>
            <p className="text-gray-500 text-sm mt-1">Finished scans</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-medium">Running</p>
            <p className="text-yellow-400 text-3xl font-bold mt-2">{stats.running}</p>
            <p className="text-gray-500 text-sm mt-1">In progress</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-medium">High Severity</p>
            <p className="text-red-400 text-3xl font-bold mt-2">{stats.high}</p>
            <p className="text-gray-500 text-sm mt-1">Total findings</p>
          </div>
        </div>

        {/* Scans Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <h2 className="text-white font-bold text-xl">Recent Scans</h2>
            <Link
              to="/new-scan"
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              + New Scan
            </Link>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading scans...</p>
            </div>
          ) : scans.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-white font-bold text-xl">No scans yet</p>
              <p className="text-gray-400 mt-2">Start your first security scan</p>
              <Link
                to="/new-scan"
                className="inline-block mt-4 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                Start First Scan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Domain</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Status</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">High</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Medium</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Date</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{scan.domain}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scan.status)}`}>
                          {scan.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-red-400 font-bold">{scan.high_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400 font-bold">{scan.medium_count || 0}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-400">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/scans/${scan.id}`}
                          className="text-red-500 hover:text-red-400 font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
