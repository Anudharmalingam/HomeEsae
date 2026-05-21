import React, { useState, useEffect } from 'react';
import { serviceCatalog } from '../../config/serviceCatalog';


const WorkerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    category: '',
    pricing: { amount: '', type: 'hour' },
    location: { address: '' }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workers/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setProfile(data);
      setFormData({
        bio: data.bio || '',
        experience: data.experience || '',
        category: data.category || '',
        pricing: data.pricing || { amount: '', type: 'hour' },
        location: data.location || { address: '' }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/workers/${profile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">My Professional Profile</h1>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-50">
        <div className="h-32 bg-primary"></div>
        <div className="px-8 pb-8 -mt-16">
          <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
             <div className="w-32 h-32 bg-white rounded-3xl shadow-lg p-2">
                <div className="w-full h-full bg-blue-50 rounded-2xl flex items-center justify-center text-4xl font-black text-primary">
                  {profile.userId?.name?.charAt(0)}
                </div>
             </div>
             <div className="flex-1 pb-4">
                <h2 className="text-2xl font-black">{profile.userId?.name}</h2>
                <p className="text-primary font-bold uppercase tracking-widest text-sm">{profile.category}</p>
             </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {serviceCatalog.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Experience (Years)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-medium"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">About / Bio</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-medium h-32"
                  placeholder="Tell customers about your skills and reliability..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hourly Rate (₹)</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-medium"
                    value={formData.pricing.amount}
                    onChange={(e) => setFormData({...formData, pricing: {...formData.pricing, amount: e.target.value}})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Service City</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none font-medium"
                    value={formData.location.address}
                    onChange={(e) => setFormData({...formData, location: {address: e.target.value}})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all"
              >
                Save Profile Changes
              </button>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Experience</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{profile.experience} Years</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</p>
                  <p className="text-xl font-black text-gray-900 mt-1">₹{profile.pricing?.amount}/{profile.pricing?.type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-xl font-black text-gray-900 mt-1">{profile.location?.address}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">About Me</h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-6 rounded-3xl border border-dashed border-gray-200">
                  {profile.bio || "No bio added yet. Tell people about your amazing skills!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
