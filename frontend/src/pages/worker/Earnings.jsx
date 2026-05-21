import React from 'react';

const Earnings = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Available for Withdrawal</span>
          <span className="text-4xl font-black text-primary mt-2">₹0.00</span>
          <button className="mt-6 px-8 py-2 bg-primary text-white rounded-full font-bold hover:bg-blue-600 transition-all">Withdraw Now</button>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Earnings this Month</span>
          <span className="text-4xl font-black text-green-600 mt-2">₹0.00</span>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-gray-500 font-medium">Total Lifetime Earnings</span>
          <span className="text-4xl font-black text-gray-900 mt-2">₹0.00</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <div className="p-12 text-center text-gray-400">
          No transactions yet. Complete your first job to start earning!
        </div>
      </div>
    </div>
  );
};

export default Earnings;
