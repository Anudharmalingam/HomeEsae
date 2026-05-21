import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NewBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { workerId, workerName, price, category } = location.state || {};

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 1,
    address: '',
    isUrgent: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          workerId,
          serviceType: category,
          date: formData.date,
          time: formData.time,
          price: (price || 500) * formData.duration,
          isUrgent: formData.isUrgent,
          address: formData.address
        })
      });

      if (res.ok) {
        alert('Booking successful!');
        navigate('/dashboard');
      } else {
        const data = await res.json();
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      alert('Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  if (!workerId) return <div className="text-center py-20">Please select a worker first</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Book {workerName}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
          <input 
            type="date" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary" 
            required 
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input 
              type="time" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary" 
              required 
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
            <input 
              type="number" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary" 
              required 
              min="1" 
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Address</label>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary h-24" 
            placeholder="Enter full address..."
            required
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          ></textarea>
        </div>

        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <input 
            type="checkbox" 
            id="urgent" 
            className="w-5 h-5 text-red-600 rounded focus:ring-red-500" 
            checked={formData.isUrgent}
            onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
          />
          <label htmlFor="urgent" className="text-sm font-semibold text-red-700">This is an emergency/urgent booking</label>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl">
           <p className="text-sm text-blue-700">Total Price: <span className="text-xl font-black">₹{(price || 500) * formData.duration}</span></p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default NewBooking;
