import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  History,
  TrendingUp,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Activity,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
  { to: '/history', label: 'History', icon: History },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/assistant', label: 'Assistant', icon: MessageCircle },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-surface">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-gray-100 
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
            <Activity className="w-7 h-7 text-teal" />
            <span className="text-xl font-bold text-navy">
              Physio<span className="text-teal">AI</span>
            </span>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal/10 text-teal'
                      : 'text-navy/60 hover:bg-gray-50 hover:text-navy'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center">
                <span className="text-sm font-medium text-teal">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy truncate">{user?.name}</p>
                <p className="text-xs text-navy/50 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 text-navy/40 hover:text-red-500 transition-colors"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-navy" />
          </button>
          <Activity className="w-6 h-6 text-teal" />
          <span className="text-lg font-bold text-navy">
            Physio<span className="text-teal">AI</span>
          </span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
