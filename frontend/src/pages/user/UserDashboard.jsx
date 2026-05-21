import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">Welcome, {user.name}!</h1>
        <Link to="/search" className="bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-blue-200">Book New Service</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Bookings</h3>
          <p className="text-3xl font-black mt-2">{bookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'in-progress').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Spent</h3>
          <p className="text-3xl font-black mt-2">₹{bookings.reduce((acc, b) => acc + (b.price || 0), 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Membership</h3>
          <p className="text-3xl font-black mt-2 text-primary">Silver</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No bookings found.</p>
            <Link to="/search" className="text-primary font-bold">Start exploring services →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.map(booking => (
              <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-primary font-bold">
                    {booking.serviceType?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{booking.serviceType}</h4>
                    <p className="text-sm text-gray-500">with {booking.worker?.userId?.name}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                  <p>{booking.time}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-black text-lg">₹{booking.price}</div>
                  {booking.status === 'accepted' && (
                    <Link 
                      to={`/chat/${booking._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md shadow-blue-100"
                    >
                      <span className="text-lg">💬</span>
                      <span>Chat</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
