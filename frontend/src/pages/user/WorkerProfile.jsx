import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${id}`);
      const data = await res.json();
      setWorker(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    navigate('/book', { state: { workerId: id, workerName: worker?.userId?.name, price: worker?.pricing?.amount, category: worker?.category } });
  };

  const handleChatNow = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/user`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const bookings = await res.json();
      const existing = bookings.find(b => b.worker?._id === id && b.status === 'accepted');
      
      if (existing) {
        navigate(`/chat/${existing._id}`);
      } else {
        alert('Please book the professional first to start a chat!');
        handleBookNow();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">Loading profile...</div>;
  if (!worker) return <div className="text-center py-20 text-red-500">Worker not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-primary h-32 w-full"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <div className="w-32 h-32 bg-white rounded-full p-1 border-4 border-white shadow-lg">
               <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-primary text-4xl font-bold">
                {worker.userId?.name?.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight">{worker.userId?.name}</h1>
              <p className="text-primary font-bold uppercase tracking-widest text-sm mt-1">{worker.category}</p>
              <div className="flex items-center gap-1 text-yellow-500 font-bold mt-2">
                {worker.rating || 4.5} ★ <span className="text-gray-400 font-medium text-sm ml-1">(12 reviews)</span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-center">
              <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Base Price</span>
              <span className="text-2xl font-black text-gray-900">₹{worker.pricing?.amount || 500}/{worker.pricing?.type}</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">About</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional {worker.category} with years of experience. Committed to providing high-quality service and customer satisfaction.
              </p>
              <h3 className="font-bold text-lg mt-6 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Experienced', 'Reliable', 'Punctual', 'Verified'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={handleBookNow} className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform">
                Book Now
              </button>
              <button onClick={handleChatNow} className="w-full bg-white border-2 border-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
                Chat with {worker.userId?.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
