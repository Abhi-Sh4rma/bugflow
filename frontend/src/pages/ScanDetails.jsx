import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { scansAPI } from '../services/api';
import toast from 'react-hot-toast';

const ScanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchScan();
    const interval = setInterval(() => {
      if (scan?.status === 'running') fetchScan();
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchScan = async () => {
    try {
      const response = await scansAPI.getById(id);
      setScan(response.data);
    } catch (error) {
      toast.error('Failed to load scan');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (!scan) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="text-center py-20">
        <p className="text-white text-xl">Scan not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white mb-2 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-white font-bold text-3xl">{scan.domain}</h1>
            <p className="text-gray-400 mt-1">
              Scan #{scan.id} • {new Date(scan.created_at).toLocaleString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full font-bold text-sm border ${
            scan.status === 'completed' ? 'text-green-400 bg-green-400/10 border-green-400/30' :
            scan.status === 'running' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' :
            'text-red-400 bg-red-400/10 border-red-400/30'
          }`}>
            {scan.status === 'running' && '⚡ '}
            {scan.status.toUpperCase()}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Critical', value: scan.critical_count || 0, color: 'text-purple-400' },
            { label: 'High', value: scan.high_count || 0, color: 'text-red-400' },
            { label: 'Medium', value: scan.medium_count || 0, color: 'text-yellow-400' },
            { label: 'Info', value: scan.info_count || 0, color: 'text-blue-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className={`${stat.color} text-3xl font-bold mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {['overview', 'subdomains', 'ports', 'vulnerabilities', 'report'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🌐 Subdomains</h3>
              <p className="text-3xl font-bold text-red-400">
                {scan.subdomains?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">discovered</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🔌 Open Ports</h3>
              <p className="text-3xl font-bold text-red-400">
                {scan.ports?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">found</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">🛡️ Technologies</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {scan.technologies?.length > 0 ? (
                  scan.technologies.map((tech, i) => (
                    <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No technologies detected</p>
                )}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">⚠️ Vulnerabilities</h3>
              <p className="text-3xl font-bold text-red-400">
                {scan.vulnerabilities?.length || 0}
              </p>
              <p className="text-gray-400 text-sm mt-1">total findings</p>
            </div>
          </div>
        )}

        {/* Subdomains */}
        {activeTab === 'subdomains' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-white font-bold">
                Discovered Subdomains ({scan.subdomains?.length || 0})
              </h3>
            </div>
            {scan.subdomains?.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {scan.subdomains.map((sub, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <span className="text-white font-mono">{sub.subdomain || sub}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sub.is_alive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {sub.is_alive ? 'Alive' : 'Dead'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 p-6">No subdomains found</p>
            )}
          </div>
        )}

        {/* Ports */}
        {activeTab === 'ports' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-white font-bold">
                Open Ports ({scan.ports?.length || 0})
              </h3>
            </div>
            {scan.ports?.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-gray-400 px-6 py-3">Port</th>
                    <th className="text-left text-gray-400 px-6 py-3">Protocol</th>
                    <th className="text-left text-gray-400 px-6 py-3">Service</th>
                    <th className="text-left text-gray-400 px-6 py-3">State</th>
                  </tr>
                </thead>
                <tbody>
                  {scan.ports.map((port, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="px-6 py-4 text-red-400 font-bold font-mono">{port.port}</td>
                      <td className="px-6 py-4 text-gray-300">{port.protocol}</td>
                      <td className="px-6 py-4 text-gray-300">{port.service}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">
                          {port.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 p-6">No open ports found</p>
            )}
          </div>
        )}

        {/* Vulnerabilities */}
        {activeTab === 'vulnerabilities' && (
          <div className="space-y-4">
            {scan.vulnerabilities?.length > 0 ? (
              scan.vulnerabilities.map((vuln, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">{vuln.vuln_type || vuln.type}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{vuln.description}</p>
                  {vuln.host && (
                    <p className="text-gray-500 text-xs mt-2 font-mono">Host: {vuln.host}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
                <p className="text-green-400 text-xl font-bold">✅ No vulnerabilities found</p>
                <p className="text-gray-400 mt-2">Target looks clean!</p>
              </div>
            )}
          </div>
        )}

        {/* AI Report */}
        {activeTab === 'report' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
            <h3 className="text-white font-bold text-xl mb-6">🤖 AI Security Report</h3>
            {scan.ai_report ? (
              <div className="prose prose-invert max-w-none">
                <pre className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed text-sm">
                  {scan.ai_report}
                </pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl">📄 Report not generated yet</p>
                <p className="text-gray-500 mt-2">
                  Report generates automatically when scan completes
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ScanDetails;
