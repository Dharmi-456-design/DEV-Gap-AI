import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  RiDashboardLine, RiBrainLine, RiGithubLine, RiFileTextLine,
  RiRoadMapLine, RiLightbulbLine, RiLineChartLine, RiUserLine,
  RiMenuLine, RiCloseLine, RiLogoutBoxLine, RiSparklingLine,
  RiPsychotherapyLine
} from 'react-icons/ri';

const navItems = [
  { path: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { path: '/mentor-mode', icon: RiPsychotherapyLine, label: 'Mentor Mode', highlight: true },
  { path: '/career-intent', icon: RiBrainLine, label: 'Intent Engine' },
  { path: '/career-decision', icon: RiSparklingLine, label: 'Career Decision' },
  { path: '/github', icon: RiGithubLine, label: 'GitHub Analyzer' },
  { path: '/resume', icon: RiFileTextLine, label: 'Resume Upload' },
  { path: '/roadmap', icon: RiRoadMapLine, label: 'Elite Roadmap', highlight: true },
  { path: '/trends', icon: RiLineChartLine, label: 'Job Trends' },
  { path: '/profile', icon: RiUserLine, label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-inter">
      {/* Mobile Header / Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-white/5 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
            <RiSparklingLine className="text-slate-900 text-lg" />
          </div>
          <h1 className="font-black text-white text-sm tracking-tighter">DevGap<span className="text-primary-400">AI</span></h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-slate-400 hover:text-white"
        >
          <RiMenuLine size={24} />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[70] animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[80]
        ${sidebarOpen ? 'w-72 lg:w-64' : 'w-72 lg:w-20'} 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-all duration-300 ease-in-out
        bg-slate-800 border-r border-white/5 flex flex-col
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <RiSparklingLine className="text-slate-900 text-xl" />
          </div>
          {(sidebarOpen || isMobileMenuOpen) && (
            <div className="flex-1 animate-fade-in">
              <h1 className="font-black text-white text-base leading-none">DevGap<span className="text-primary-400"> AI</span></h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Protocol Beta</p>
            </div>
          )}
          <button
            onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block text-slate-500 hover:text-primary-400 transition-colors p-1"
          >
            {sidebarOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-slate-500 hover:text-red-400 transition-colors"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(({ path, icon: Icon, label, highlight }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? highlight
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                      : 'bg-primary-500/20 text-primary-400 border border-primary-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110`} />
                  {(sidebarOpen || isMobileMenuOpen) && (
                    <span className="text-sm font-semibold tracking-tight">{label}</span>
                  )}
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-800/50">
          <div className={`flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-700/50 cursor-pointer transition-all ${(!sidebarOpen && !isMobileMenuOpen) && 'justify-center'}`}>
            <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-slate-900 font-black border-2 border-white/10 shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {(sidebarOpen || isMobileMenuOpen) && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-bold text-white truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate font-black uppercase tracking-tighter">Certified Career Pro</p>
              </div>
            )}
            {(sidebarOpen || isMobileMenuOpen) && (
              <button 
                onClick={handleLogout} 
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                title="Logout"
              >
                <RiLogoutBoxLine size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pt-16 lg:pt-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0b1120] relative">
          <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary-600/5 to-transparent pointer-events-none" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
