import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleLogin = () => {
    loginWithGoogle();
    navigate('/select-portal');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #1d4ed8 70%, #0369a1 100%)' }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative w-full max-w-md mx-4" style={{ animation: 'fadeUp 0.6s ease both' }}>
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255,255,255,0.15)',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 mb-5"
              style={{ boxShadow: '0 8px 32px rgba(59,130,246,0.45)' }}>
              <span className="text-white font-display font-bold text-2xl">⚛</span>
            </div>
            <h1 className="text-4xl font-display font-bold text-white tracking-tight">HireSmart</h1>
            <p className="text-brand-200 text-sm font-medium mt-2 tracking-wide">The Smart ATS Hiring Platform</p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-7" />
          <p className="text-center text-white/55 text-sm font-medium mb-5">Sign in to access your workspace</p>

          <button onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl font-semibold text-slate-800 text-sm bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="mt-7 flex flex-wrap gap-2 justify-center">
            {['🤖 AI-Powered', '📊 ATS System', '🧠 Smart Matching', '🔒 Secure'].map((f) => (
              <span key={f} className="px-3 py-1 rounded-full text-xs font-medium text-white/55"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                {f}
              </span>
            ))}
          </div>
        </div>
        <p className="text-center text-white/25 text-xs mt-5">By signing in you agree to our Terms &amp; Privacy Policy</p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
