import React from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react';

const Wallet = () => {
  const transactions = [
    { id: 1, type: 'payment', amount: 600, date: '2026-05-06', status: 'Completed', worker: 'Rajesh Kumar', service: 'Plumbing' },
    { id: 2, type: 'refund', amount: 400, date: '2026-05-04', status: 'Refunded', worker: 'Meena Kumari', service: 'Maid' },
    { id: 3, type: 'payment', amount: 1200, date: '2026-05-01', status: 'Completed', worker: 'Arun Kumar', service: 'Painter' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tight">My Wallet</h1>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-105 transition-all">
          <Plus size={20} />
          Add Money
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
            <h2 className="text-5xl font-black mb-12">₹5,000.00</h2>
            <div className="flex justify-between items-end">
               <div>
                 <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Card Holder</p>
                 <p className="font-bold">{JSON.parse(localStorage.getItem('user') || '{}').name}</p>
               </div>
               <CreditCard size={32} className="opacity-50" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <ArrowDownLeft size={32} />
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Spent</p>
          <h3 className="text-2xl font-black text-gray-900">₹1,800</h3>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6">Payment Details & History</h3>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Service</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Professional</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-bold text-gray-900">{tx.service}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${tx.type === 'payment' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-8 py-6 text-gray-600 font-medium">{tx.worker}</td>
                <td className="px-8 py-6 text-gray-400 text-sm font-medium">{tx.date}</td>
                <td className={`px-8 py-6 text-right font-black ${tx.type === 'payment' ? 'text-gray-900' : 'text-green-600'}`}>
                  {tx.type === 'payment' ? '-' : '+'}₹{tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
