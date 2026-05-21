import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const WorkerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/bookings/worker', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      console.log('Worker Jobs:', data);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [completionData, setCompletionData] = useState({
    actualPrice: '',
    notes: '',
    location: ''
  });

  const handleUpdateStatus = async (id, status) => {
    const cleanStatus = status.toLowerCase();
    console.log('Requesting status update:', id, cleanStatus);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: cleanStatus })
      });
      
      if (res.ok) {
        console.log('Status update successful');
        alert(`Booking updated to ${cleanStatus} successfully!`);
        fetchJobs();
      } else {
        const errorData = await res.json();
        console.error('Update failed:', errorData);
        alert(`Error: ${errorData.message || 'Failed to update status'}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error. Is the server running?');
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${selectedJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          status: 'completed',
          completionDetails: {
            ...completionData,
            completedAt: new Date()
          }
        })
      });
      if (res.ok) {
        alert('Work completion entry saved successfully!');
        setShowCompleteForm(false);
        fetchJobs();
      }
    } catch (err) {
      alert('Error saving completion entry');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 tracking-tight">Worker Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Today's Jobs</h3>
          <p className="text-3xl font-black mt-2">{jobs.filter(j => j.status === 'accepted').length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Earnings (Pending)</h3>
          <p className="text-3xl font-black mt-2">₹{jobs.reduce((acc, j) => acc + (j.price || 0), 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Rating</h3>
          <p className="text-3xl font-black mt-2">4.8 ★</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Status</h3>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-sm text-green-600">Online</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Job Requests</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No job requests yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.map(job => (
              <div key={job._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 font-bold">
                    {job.serviceType?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{job.serviceType}</h4>
                    <p className="text-sm text-gray-500">Customer: {job.user?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{job.address}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-bold text-gray-900">{new Date(job.date).toLocaleDateString()}</p>
                  <p className="text-gray-500">{job.time}</p>
                </div>

                <div className="flex gap-2 relative z-50">
                  {(job.status?.toLowerCase() === 'pending') ? (
                    <>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'accepted')}
                        className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-md shadow-blue-100 cursor-pointer"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(job._id, 'rejected')}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${
                        job.status?.toLowerCase() === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {job.status}
                      </span>
                      {job.status?.toLowerCase() === 'accepted' && (
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => { console.log('Complete clicked'); setSelectedJob(job); setShowCompleteForm(true); setCompletionData({ actualPrice: job.price, location: job.address || '', notes: '' }); }}
                            className="px-6 py-3 bg-green-600 text-white rounded-2xl font-black text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100 cursor-pointer active:scale-95 z-[60]"
                          >
                            Mark Complete
                          </button>
                          <Link 
                            to={`/chat/${job._id}`}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 active:scale-95 z-[60]"
                          >
                            <span className="text-lg">💬</span>
                            <span>Open Chat</span>
                          </Link>
                          <button 
                            onClick={() => handleUpdateStatus(job._id, 'rejected')}
                            className="px-4 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all cursor-pointer active:scale-95 z-[60]"
                            title="Cancel Job"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Form Modal */}
      {showCompleteForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Work Completion Entry</h2>
            <form onSubmit={handleCompleteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Work Location (Evidence)</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary font-medium"
                  value={completionData.location}
                  onChange={(e) => setCompletionData({...completionData, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Final Salary Received</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary font-medium"
                    value={completionData.actualPrice}
                    onChange={(e) => setCompletionData({...completionData, actualPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Completion Date</label>
                  <input 
                    type="text" 
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none font-medium text-gray-500"
                    value={new Date().toLocaleDateString()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Work Summary / Notes</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary font-medium h-24"
                  placeholder="Describe the work done..."
                  value={completionData.notes}
                  onChange={(e) => setCompletionData({...completionData, notes: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCompleteForm(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-all"
                >
                  Submit Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;
