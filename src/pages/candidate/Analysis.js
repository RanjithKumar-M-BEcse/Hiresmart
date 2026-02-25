import { useState } from 'react';
import CandidateSidebar from '../../components/CandidateSidebar';
import Navbar from '../../components/Navbar';
import { candidateAnalysisMock } from '../../data/mockData';

const RADIUS = 52;
const CIRC   = 2 * Math.PI * RADIUS;
const r      = candidateAnalysisMock;

export default function CandidateAnalysis() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resume,      setResume]      = useState(null);
  const [jobTitle,    setJobTitle]    = useState('Senior Frontend Engineer');
  const [analyzing,   setAnalyzing]   = useState(false);
  const [result,      setResult]      = useState(r); // show mock by default

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f?.type === 'application/pdf') setResume(f);
  };

  const handleAnalyze = () => {
    if (!resume) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult({ ...r, role: jobTitle.trim() || r.role });
      setAnalyzing(false);
    }, 2200);
  };

  const scoreColor =
    result.matchPercent >= 80 ? 'text-emerald-600' :
    result.matchPercent >= 60 ? 'text-brand-600'   : 'text-amber-600';
  const barColor =
    result.matchPercent >= 80 ? 'bg-emerald-500' :
    result.matchPercent >= 60 ? 'bg-brand-500'   : 'bg-amber-500';
  const ringStroke =
    result.matchPercent >= 80 ? '#10b981' :
    result.matchPercent >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <CandidateSidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar portal="candidate" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Resume Analysis" />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Upload + re-analyze bar */}
          <div className="card">
            <h2 className="section-title mb-4">Run Analysis</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors">
                <span className="text-xl">{resume ? '📄' : '☁️'}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{resume ? resume.name : 'Upload Resume (PDF)'}</p>
                  <p className="text-xs text-slate-400">{resume ? `${(resume.size/1024).toFixed(1)} KB` : 'Click or drag & drop'}</p>
                </div>
                <input type="file" accept=".pdf,application/pdf" onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
              <input className="form-input flex-1"
                placeholder="Target job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)} />
              <button onClick={handleAnalyze} disabled={!resume || analyzing}
                className="btn-emerald px-6 py-3 disabled:opacity-50 shrink-0">
                {analyzing ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : '🤖 Analyze'}
              </button>
            </div>
            {analyzing && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-emerald-600 font-semibold">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 ai-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }} />
                ))}
                AI is analyzing your resume…
              </div>
            )}
          </div>

          {/* Report */}
          <div className="space-y-5">

            {/* Score + Skills breakdown row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Score ring */}
              <div className="card flex flex-col items-center justify-center text-center">
                <h3 className="section-title mb-5">Match Score</h3>
                <div className="relative w-36 h-36 mb-4">
                  <svg width="144" height="144" className="rotate-[-90deg]">
                    <circle cx="72" cy="72" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                    <circle cx="72" cy="72" r={RADIUS} fill="none"
                      stroke={ringStroke} strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={CIRC * (1 - result.matchPercent / 100)}
                      style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-display font-black ${scoreColor}`}>{result.matchPercent}%</span>
                    <span className="text-xs text-slate-400 font-semibold">Match</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {result.matchPercent >= 80 ? '🌟 Excellent!' :
                   result.matchPercent >= 60 ? '👍 Good' : '⚠️ Below average'}
                </p>
                <p className="text-xs text-slate-400 mt-1">For: {result.role}</p>
              </div>

              {/* Skills */}
              <div className="lg:col-span-2 card space-y-4">
                <h3 className="section-title">Skills Breakdown</h3>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-emerald-700">✓ Extracted Skills</span>
                    <span className="badge badge-green">{result.extractedSkills.length} found</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.extractedSkills.map((s) => <span key={s} className="badge badge-green">{s}</span>)}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-red-600">✗ Missing Skills</span>
                    <span className="badge badge-red">{result.missingSkills.length} gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missingSkills.map((s) => <span key={s} className="badge badge-red">{s}</span>)}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Coverage bars */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">Skill Category Coverage</p>
                  {[
                    { label: 'Frontend Skills',  pct: 85, color: 'bg-brand-500'   },
                    { label: 'Backend / APIs',   pct: 70, color: 'bg-violet-500'  },
                    { label: 'Dev Tooling',      pct: 90, color: 'bg-emerald-500' },
                    { label: 'Database / Query', pct: 50, color: 'bg-amber-500'   },
                  ].map((item) => (
                    <div key={item.label} className="mb-2.5">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span className="font-medium">{item.label}</span>
                        <span className="font-bold text-slate-700">{item.pct}%</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full progress-bar ${item.color}`}
                          style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="card">
              <h3 className="section-title mb-5">🤖 AI Improvement Suggestions</h3>
              <div className="space-y-3">
                {result.suggestions.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization tips */}
            <div className="card">
              <h3 className="section-title mb-5">📄 Resume Optimization Tips</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.optimizationTips.map((tip, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-amber-500 text-lg shrink-0">💡</span>
                    <p className="text-sm text-slate-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
