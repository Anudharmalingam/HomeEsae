import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Signup from './pages/public/Signup';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import SearchWorkers from './pages/user/SearchWorkers';
import NewBooking from './pages/user/NewBooking';
import WorkerProfile from './pages/user/WorkerProfile';
import Wallet from './pages/user/Wallet';

// Worker Pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import Earnings from './pages/worker/Earnings';
import WorkerProfilePage from './pages/worker/WorkerProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageWorkers from './pages/admin/ManageWorkers';

// Shared Pages
import Chat from './pages/shared/Chat';
import Notifications from './pages/shared/Notifications';
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center fixed w-full top-0 z-50">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-black text-primary tracking-tighter">Ease Home.</Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors border px-3 py-1 rounded-md"
          >
            {i18n.language === 'en' ? 'தமிழ்' : 'English'}
          </button>
          
          {!localStorage.getItem('token') ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-primary font-medium">Login</Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium">Dashboard</Link>
              <button onClick={logout} className="text-red-500 font-medium hover:underline">Logout</button>
            </>
          )}
        </div>
      </nav>

      <div className="pt-20 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout role="user">
                <UserDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout role="user">
                <SearchWorkers />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/book" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout role="user">
                <NewBooking />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout role="user">
                <Wallet />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/worker-profile/:id" element={
            <ProtectedRoute allowedRoles={['user']}>
              <DashboardLayout role="user">
                <WorkerProfile />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/chat/:bookingId" element={
            <ProtectedRoute allowedRoles={['user', 'worker']}>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['user', 'worker']}>
               <DashboardLayout role={JSON.parse(localStorage.getItem('user') || '{}').role}>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Worker Routes */}
          <Route path="/worker/dashboard" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <DashboardLayout role="worker">
                <WorkerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/worker/profile" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <DashboardLayout role="worker">
                <WorkerProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/worker/earnings" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <Earnings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/workers" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageWorkers />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
