import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, Calendar, Wallet, Bell, MessageSquare, LogOut, User } from 'lucide-react';

const DashboardLayout = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'My Bookings', path: '/dashboard', icon: Calendar },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const workerLinks = [
    { name: 'Dashboard', path: '/worker/dashboard', icon: LayoutDashboard },
    { name: 'Job Requests', path: '/worker/dashboard', icon: Bell },
    { name: 'Earnings', path: '/worker/earnings', icon: Wallet },
    { name: 'Profile', path: '/worker/profile', icon: User },
  ];

  const links = role === 'worker' ? workerLinks : userLinks;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-black text-primary tracking-tighter">Ease Home.</Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-blue-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon size={20} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-primary font-bold">
                {user.name?.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{role}</p>
                <p className="text-sm font-black text-gray-900">{user.name}</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <Link to={role === 'worker' ? '/worker/earnings' : '/wallet'} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-bold text-sm hover:bg-green-100 transition-all border border-green-100">
                <Wallet size={18} />
                <span>₹{role === 'worker' ? '2400' : '5000'}</span>
              </Link>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
                <Bell size={20} />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              </button>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                <MessageSquare size={20} />
              </button>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
