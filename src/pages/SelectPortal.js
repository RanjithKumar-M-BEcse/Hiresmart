import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const portals = [
  {
    id: 'recruiter',
    emoji: '👨🏻‍💻',
    title: 'Recruiter Portal',
    subtitle: 'ATS System',
    desc: 'Post jobs, review AI-matched applicants, manage your hiring pipeline, and close roles with interview scheduling.',
    badge: 'For Hiring Teams',
    badgeClass: 'badge-blue',
    features: ['Create job openings', 'AI applicant matching', 'Close job & schedule interviews'],
    accentFrom: 'from-brand-500',
    accentTo: 'to-brand-700',
    hoverBorder: 'hover:border-brand-300',
    hoverBg: 'hover:bg-brand-50/60',
    ctaColor: 'text-brand-600',
  },
  {
    id: 'candidate',
    emoji: '👤',
    title: 'Candidate Portal',
    subtitle: 'Resume Analyzer',
    desc: 'Upload your resume, analyze it against any job title using AI, discover skill gaps, and get personalized improvement tips.',
    badge: 'For Job Seekers',
    badgeClass: 'badge-green',
    features: ['AI resume analysis', 'Skill gap detection', 'Improvement suggestions'],
    accentFrom: 'from-emerald-500',
    accentTo: 'to-emerald-700',
    hoverBorder: 'hover:border-emerald-300',
    hoverBg: 'hover:bg-emerald-50/60',
    ctaColor: 'text-emerald-600',
  },
];

export default function SelectPortal() {
  const navigate = useNavigate();
  const { selectPortal, isProfileComplete, user } = useAuth();

  const handleSelect = (portalId) => {
    selectPortal(portalId);
    if (portalId === 'recruiter') {
      navigate(isProfileComplete ? '/recruiter/dashboard' : '/recruiter/complete-profile');
    } else {
      navigate('/candidate/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10" style={{ animation: 'fadeUp 0.5s ease both' }}>
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">֎</span>
          </div>
          <span className="font-display font-bold text-slate-900 text-xl">
            <span className="text-brand-600">HireSmart</span>
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 mt-2">
          Welcome {user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
        </h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Select your portal for this session
        </p>
      </div>

      {/* Portal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {portals.map((p, i) => (
          <button
            key={p.id}
            onClick={() => handleSelect(p.id)}
            className={`text-left card border-2 border-transparent ${p.hoverBorder} ${p.hoverBg} hover:-translate-y-2 hover:shadow-card-lg transition-all duration-300 cursor-pointer`}
            style={{ animation: `fadeUp 0.5s ${i * 0.1 + 0.1}s ease both` }}
          >
            {/* Top */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.accentFrom} ${p.accentTo} flex items-center justify-center text-2xl shadow-md`}>
                {p.emoji}
              </div>
              <span className={`badge ${p.badgeClass}`}>{p.badge}</span>
            </div>

            {/* Title */}
            <h2 className="font-display font-bold text-slate-900 text-xl mb-0.5">{p.title}</h2>
            <p className={`text-xs font-bold mb-3 ${p.ctaColor}`}>{p.subtitle}</p>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">{p.desc}</p>

            {/* Features */}
            <ul className="space-y-1.5 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-brand-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className={`flex items-center gap-1 text-sm font-bold ${p.ctaColor}`}>
              Enter {p.title}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
