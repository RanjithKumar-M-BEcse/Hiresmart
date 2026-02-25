import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    to: '/candidate/dashboard',
    label: 'Dashboard',
    icon: (<svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>),
  },
  {
    to: '/candidate/analysis',
    label: 'Resume Analysis',
    icon: (<svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>),
  },
];

export default function CandidateSidebar({ isOpen }) {
  const { user, logout } = useAuth();
  return (
    <aside className={`shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 transition-all duration-300 overflow-hidden ${isOpen ? 'w-60' : 'w-0 border-r-0'}`}>
      <div className="w-60 flex flex-col h-full">
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
              <span className="text-white font-display font-bold text-sm">H</span>
            </div>
            <span className="font-display font-bold text-xl"><span className="text-slate-900">Hire</span><span className="text-emerald-600">Smart</span></span>
          </div>
          <div className="mt-2"><span className="badge badge-green">Candidate Portal</span></div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-3">Navigation</p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `sidebar-link-emerald${isActive ? ' active' : ''}`}>
              {item.icon}<span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{user?.avatar || 'U'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Candidate'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={logout} className="sidebar-link-emerald w-full text-red-400 hover:text-red-600 hover:bg-red-50">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
