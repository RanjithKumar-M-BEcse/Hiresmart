import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CandidateLayout({ children, title }) {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const isDash = location.pathname === '/candidate/dashboard';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {open && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed lg:static top-0 left-0 z-40 h-screen bg-white border-r border-slate-100
        flex flex-col shrink-0 transition-all duration-300 ease-in-out overflow-hidden
        ${open ? 'w-60' : 'w-0'}
      `}>
        <div className="w-60 flex flex-col h-full">
          <div className="px-5 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">H</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                <span className="text-slate-900">Hire</span>
                <span className="text-emerald-600">Smart</span>
              </span>
            </div>
            <span className="badge badge-green text-xs">Candidate Portal</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Tools</p>
            <NavLink
              to="/candidate/dashboard"
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              style={({ isActive }) => isActive ? { color: '#059669', background: '#ecfdf5' } : {}}
            >
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Resume Analyzer</span>
            </NavLink>
          </nav>

          <div className="px-3 py-4 border-t border-slate-100 space-y-2">
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{user.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="sidebar-link text-red-400 hover:text-red-600 hover:bg-red-50">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3 px-5 h-14">
            <button
              onClick={() => setOpen(o => !o)}
              className="w-8 h-8 rounded-lg flex flex-col items-center justify-center gap-[5px] hover:bg-slate-100 transition-colors shrink-0"
            >
              <span className="block w-[16px] h-[1.5px] bg-slate-600 rounded" />
              <span className="block w-[16px] h-[1.5px] bg-slate-600 rounded" />
              <span className="block w-[16px] h-[1.5px] bg-slate-600 rounded" />
            </button>
            {!isDash && (
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <span className="font-display font-bold text-base">
              <span className="text-slate-900">Hire</span>
              <span className="text-emerald-600">Smart</span>
              {title && <span className="text-slate-400 font-normal text-sm ml-2">— {title}</span>}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
