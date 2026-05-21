import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { serviceCatalog } from '../../config/serviceCatalog';


const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('user'); // 'user' or 'worker'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    category: 'maid',
    experience: '',
    pricingType: 'hour',
    pricingAmount: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [createdUserId, setCreatedUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Reset OTP UI state on attempt
    setCreatedUserId('');
    setOtp('');
    setDevOtp('');

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      };

      if (role === 'worker') {
        payload.workerDetails = {
          category: formData.category,
          experience: Number(formData.experience),
          pricing: {
            amount: Number(formData.pricingAmount),
            type: formData.pricingType,
          },
        };
      }

      const resp = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.message || 'Signup failed');
        return;
      }

      setCreatedUserId(data?.userId || '');
      setDevOtp(String(data?.devOtp || ''));
    } catch (err) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: createdUserId, otp }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data?.message || 'OTP verification failed');
        return;
      }

      if (data?.token) {
        localStorage.setItem('token', data.token);
        const userObj = {
          id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        
        if (userObj.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userObj.role === 'worker') {
          navigate('/worker/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500">Join Ease Home today</p>
        </div>

        {createdUserId ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <div className="font-semibold text-blue-900">Verify your OTP</div>
              <div className="text-sm text-blue-800/90 mt-1">
                Enter the OTP sent to your email.
                {devOtp ? (
                  <div className="mt-2 text-xs">
                    Dev OTP: <span className="font-mono">{devOtp}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter OTP"
              />
            </div>

            {error ? (
              <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              disabled={loading}
              onClick={handleVerifyOtp}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-60"
            >
              Verify OTP
            </button>

            <div className="text-center text-gray-600 text-sm">
              Wrong email?{' '}
              <button
                type="button"
                onClick={() => {
                  setCreatedUserId('');
                  setOtp('');
                  setDevOtp('');
                  setError('');
                }}
                className="text-primary font-bold hover:underline"
              >
                Change details
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  role === 'user'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setRole('user')}
              >
                I need a service
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                  role === 'worker'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setRole('worker')}
              >
                I want to work
              </button>
            </div>

            {error ? (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {role === 'worker' && (
                <div className="p-5 bg-blue-50 rounded-xl space-y-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-900">Worker Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      >
                        {serviceCatalog.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        required={role === 'worker'}
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pricing</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="pricingAmount"
                        required={role === 'worker'}
                        value={formData.pricingAmount}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                        placeholder="Amount"
                      />
                      <select
                        name="pricingType"
                        value={formData.pricingType}
                        onChange={handleChange}
                        className="w-1/3 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      >
                        <option value="hour">per hour</option>
                        <option value="day">per day</option>
                        <option value="task">per task</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 mt-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-60"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8 text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;

