import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-obsidian-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex-shrink-0 bg-obsidian-800 border-r border-white/5 flex flex-col`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/30">
            <RiSparklingLine className="text-obsidian-900 text-xl" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-black text-white text-sm leading-none">DevGap<span className="text-gold-400"> AI</span></h1>
              <p className="text-xs text-slate-500 mt-0.5">Career Intelligence</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-gold-400 transition-colors"
          >
            {sidebarOpen ? <RiCloseLine size={18} /> : <RiMenuLine size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, highlight }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? highlight
                      ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/20 text-purple-300 border border-purple-500/30'
                      : 'bg-gradient-to-r from-gold-500/20 to-orange-500/10 text-gold-400 border border-gold-500/20'
                    : highlight
                      ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <Icon className="text-xl flex-shrink-0" />
              {sidebarOpen && (
                <span className="text-sm font-medium flex-1">{label}</span>
              )}
              {sidebarOpen && highlight && (
                <span className="text-xs font-bold px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded-md">NEW</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/5">
          <div className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-gold-500 to-orange-500 rounded-full flex items-center justify-center text-obsidian-900 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            )}
            {sidebarOpen && (
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors" title="Logout">
                <RiLogoutBoxLine size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
