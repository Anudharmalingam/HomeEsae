import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setStatus('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const resp = await axios.post('/api/auth/reset-password', { token, password });
      setStatus(resp.data.message);
      // after success, redirect to login after a short delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-600">Invalid or missing token</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Reset Password</h2>
        {status && <p className={`mb-4 text-sm text-center ${status.includes('failed') || status.includes('match') ? 'text-red-600' : 'text-green-600'}`}>{status}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-200 p-3 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-200 p-3 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-70 mt-4"
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="text-primary font-bold hover:underline text-sm">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
