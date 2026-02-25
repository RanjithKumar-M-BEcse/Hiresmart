import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateSidebar from '../../components/CandidateSidebar';
import Navbar from '../../components/Navbar';
import { candidateAnalysisMock } from '../../data/mockData';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [resume,      setResume]      = useState(null);
  const [jobTitle,    setJobTitle]    = useState('');
  const [analyzing,   setAnalyzing]   = useState(false);
  const [result,      setResult]      = useState(null);
  const [fileError,   setFileError]   = useState('');

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { setFileError('Only PDF files are accepted.'); return; }
    setFileError('');
    setResume(f);
    setResult(null);
  };

  const handleAnalyze = () => {
    if (!resume)          { setFileError('Please upload your resume first.'); return; }
    if (!jobTitle.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult({ ...candidateAnalysisMock, role: jobTitle.trim() });
      setAnalyzing(false);
    }, 2200);
  };

  const r = result;
  const scoreColor =
    !r ? '' :
    r.matchPercent >= 80 ? 'text-emerald-600' :
    r.matchPercent >= 60 ? 'text-brand-600'   : 'text-amber-600';
  const ringStroke =
    !r ? '#e2e8f0' :
    r.matchPercent >= 80 ? '#10b981' :
    r.matchPercent >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <CandidateSidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar portal="candidate" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Banner */}
          <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg">
                <span className="text-white">Hire</span><span className="text-emerald-300">Smart</span> — Candidate Portal
              </h2>
              <p className="text-emerald-100 text-sm mt-1">Upload your resume and get an instant AI-powered ATS score.</p>
            </div>
            <button onClick={() => navigate('/candidate/analysis')}
              className="shrink-0 bg-white text-emerald-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-md">
              Full Report →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Upload + Analyze */}
            <div className="card space-y-5">
              <div>
                <h2 className="section-title">Resume Analyzer</h2>
                <p className="text-slate-400 text-sm mt-0.5">AI-powered match score against any job title</p>
              </div>

              {/* Drop zone */}
              <div className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                fileError ? 'border-red-300 bg-red-50' :
                resume    ? 'border-emerald-300 bg-emerald-50' :
                            'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'}`}>
                {resume ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📄</span>
                    <p className="text-sm font-semibold text-emerald-700">{resume.name}</p>
                    <p className="text-xs text-slate-400">{(resume.size / 1024).toFixed(1)} KB</p>
                    <button type="button" className="text-xs text-slate-400 hover:text-red-500 mt-1"
                      onClick={() => { setResume(null); setResult(null); }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl mb-3 block">☁️</span>
                    <p className="text-sm font-semibold text-slate-700">Drag &amp; drop or click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">PDF only · Max 5 MB</p>
                  </>
                )}
                <input type="file" accept=".pdf,application/pdf" onChange={handleFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
              {fileError && <p className="text-xs text-red-500">{fileError}</p>}

              <div>
                <label className="form-label">Target Job Title</label>
                <input className="form-input" placeholder="e.g. Senior Frontend Engineer"
                  value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>

              <button onClick={handleAnalyze}
                disabled={analyzing || !resume || !jobTitle.trim()}
                className="btn-emerald w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    AI is analyzing…
                  </span>
                ) : '🤖 Analyze with AI'}
              </button>

              {analyzing && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 ai-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }} />
                    ))}
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold">Extracting skills · Calculating match…</p>
                </div>
              )}
            </div>

            {/* Results panel */}
            {!result && !analyzing ? (
              <div className="card flex flex-col items-center justify-center text-center border-dashed min-h-60">
                <span className="text-5xl mb-4">🤖</span>
                <h3 className="section-title text-slate-500 mb-2">Your AI Report</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                  Upload your resume and enter a target job title, then click Analyze.
                </p>
              </div>
            ) : result ? (
              <div className="card space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Result</h2>
                  <span className="badge badge-green">✓ Done</span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg width="96" height="96" className="rotate-[-90deg]">
                      <circle cx="48" cy="48" r={36} fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                      <circle cx="48" cy="48" r={36} fill="none"
                        stroke={ringStroke} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 * (1 - r.matchPercent / 100)}
                        style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-xl font-display font-black ${scoreColor}`}>{r.matchPercent}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Match for</p>
                    <p className="font-display font-bold text-slate-900 text-base">{r.role}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {r.matchPercent >= 80 ? '🌟 Excellent match' :
                       r.matchPercent >= 60 ? '👍 Good — few gaps' : '⚠️ Needs work'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-emerald-600 mb-2">✓ Extracted Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.extractedSkills.map((s) => <span key={s} className="badge badge-green">{s}</span>)}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-red-500 mb-2">✗ Missing Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {r.missingSkills.map((s) => <span key={s} className="badge badge-red">{s}</span>)}
                  </div>
                </div>

                <button onClick={() => navigate('/candidate/analysis')} className="btn-secondary w-full">
                  Full Report with Suggestions →
                </button>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
