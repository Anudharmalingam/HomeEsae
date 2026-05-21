import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { serviceCatalog, serviceCatalogById } from '../../config/serviceCatalog';


const SearchWorkers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || ''
  });

  useEffect(() => {
    // Update URL when filters change
    const newParams = {};
    if (filters.city) newParams.city = filters.city;
    if (filters.category) newParams.category = filters.category;
    setSearchParams(newParams);
    
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.category) queryParams.append('category', filters.category);

      const res = await fetch(`http://localhost:5000/api/workers?${queryParams.toString()}`);
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Search Professionals</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Filter by city..." 
            className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary" 
            value={filters.city}
            onChange={(e) => setFilters({...filters, city: e.target.value})}
          />
          <select 
            className="px-4 py-2 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Services</option>
            {serviceCatalog.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}

          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading professionals...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map(worker => (
            <div key={worker._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                  {worker.userId?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{worker.userId?.name}</h3>
                  <p className="text-primary text-sm font-medium uppercase tracking-wider">{worker.category}</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-lg">₹{worker.pricing?.amount || 500}/{worker.pricing?.type || 'hr'}</span>
                {serviceCatalogById[worker.category]?.pricingRange ? (
                  <div className="text-xs text-gray-500 mt-1">
                    Typical: ₹{serviceCatalogById[worker.category].pricingRange.min}–₹{serviceCatalogById[worker.category].pricingRange.max}
                    {' '}
                    {serviceCatalogById[worker.category].pricingUnit ? `/${serviceCatalogById[worker.category].pricingUnit}` : ''}
                  </div>
                ) : null}

                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  {worker.rating || 4.5} ★
                </div>
              </div>
              <Link to={`/worker-profile/${worker._id}`} className="block text-center w-full bg-primary/10 text-primary mt-6 py-2 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                View Profile
              </Link>
            </div>
          ))}
          {workers.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              No professionals found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWorkers;
