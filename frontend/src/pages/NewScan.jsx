import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { scansAPI } from '../services/api';
import toast from 'react-hot-toast';

const NewScan = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean domain input
    let cleanDomain = domain.trim()
      .replace('https://', '')
      .replace('http://', '')
      .replace('www.', '')
      .split('/')[0];

    setLoading(true);
    try {
      const response = await scansAPI.create({ domain: cleanDomain });
      toast.success(`Scan started for ${cleanDomain}!`);
      navigate(`/scans/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white font-bold text-3xl">
            🎯 New Security Scan
          </h1>
          <p className="text-gray-400 mt-2">
            Enter a domain to start a full automated recon pipeline
          </p>
        </div>

        {/* Scan Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Domain Input */}
            <div>
              <label className="text-gray-400 text-sm font-medium mb-2 block">
                Target Domain
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-4 text-lg focus:outline-none focus:border-red-500 transition-colors"
              />
              <p className="text-gray-500 text-sm mt-2">
                You can also paste full URLs like https://example.com
              </p>
            </div>

            {/* What Will Run */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">
                🚀 What will run:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🔍', label: 'Subdomain Enumeration' },
                  { icon: '🌐', label: 'DNS Resolution' },
                  { icon: '🔌', label: 'Port Scanning' },
                  { icon: '🕵️', label: 'Tech Fingerprinting' },
                  { icon: '🛡️', label: 'CVE Matching' },
                  { icon: '⚡', label: 'Vulnerability Checks' },
                  { icon: '🤖', label: 'AI Report Generation' },
                  { icon: '📄', label: 'PDF Export' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 text-sm font-medium">
                ⚠️ Only scan domains you own or have written permission to test.
                Unauthorized scanning is illegal.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-bold py-4 rounded-xl text-lg transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Starting Scan...
                </span>
              ) : (
                '🚀 Start Security Scan'
              )}
            </button>

          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-3">💡 Pro Tips</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>→ Use staging domains for safer testing</li>
            <li>→ Always get written permission first</li>
            <li>→ Scan takes 5-10 minutes to complete</li>
            <li>→ PDF report auto-generates when scan completes</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default NewScan;
