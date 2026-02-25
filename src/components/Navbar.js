import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ portal = 'recruiter', onToggleSidebar, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isDashboard =
    location.pathname === '/recruiter/dashboard' ||
    location.pathname === '/candidate/dashboard';

  const Logo = () =>
    portal === 'recruiter' ? (
      <span className="font-display font-bold text-lg">
        <span className="text-brand-600">Hire</span>
        <span className="text-slate-900">Smart</span>
      </span>
    ) : (
      <span className="font-display font-bold text-lg">
        <span className="text-slate-900">Hire</span>
        <span className="text-emerald-600">Smart</span>
      </span>
    );

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30">
      <div className="flex items-center justify-between px-5 h-14 gap-4">
        <div className="flex items-center gap-3">
          {/* Hamburger */}
          <button onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-[5px] hover:bg-slate-100 transition-colors shrink-0">
            <span className="bg-slate-600 rounded block" style={{ width: '18px', height: '2px' }} />
            <span className="bg-slate-600 rounded block" style={{ width: '18px', height: '2px' }} />
            <span className="bg-slate-600 rounded block" style={{ width: '18px', height: '2px' }} />
          </button>

          {/* Back (non-dashboard pages) */}
          {!isDashboard && (
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}

          <Logo />
          {title && <span className="hidden md:block text-sm text-slate-400">/ {title}</span>}
        </div>

        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
              portal === 'recruiter'
                ? 'bg-gradient-to-br from-brand-400 to-brand-600'
                : 'bg-gradient-to-br from-emerald-400 to-emerald-600'}`}>
              {user.avatar || user.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
              {user.name}
            </span>
            <button onClick={logout}
              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Logout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
