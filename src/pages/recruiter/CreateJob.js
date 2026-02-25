import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecruiterSidebar from '../../components/RecruiterSidebar';
import Navbar from '../../components/Navbar';
import { mockJobs } from '../../data/mockData';

// MUST stay outside component — prevents focus-loss bug on every keystroke
function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {hint && <p className="text-xs text-slate-400 mb-1.5">{hint}</p>}
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CreateJob() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [keywords,    setKeywords]    = useState('');
  const [threshold,   setThreshold]   = useState('75');
  const [topN,        setTopN]        = useState('5');
  const [department,  setDepartment]  = useState('Engineering');
  const [location,    setLocation]    = useState('');
  const [jobType,     setJobType]     = useState('Full-time');
  const [submitted,   setSubmitted]   = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [errors,      setErrors]      = useState({});
  const [newPublicId, setNewPublicId] = useState('');

  const validate = () => {
    const e = {};
    if (!title.trim())       e.title       = 'Job title is required.';
    if (!description.trim()) e.description = 'Job description is required.';
    if (!keywords.trim())    e.keywords    = 'At least one keyword is required.';
    const t = Number(threshold);
    if (!threshold || isNaN(t) || t < 1 || t > 100) e.threshold = 'Enter a value between 1 and 100.';
    const n = Number(topN);
    if (!topN || isNaN(n) || n < 1) e.topN = 'Enter a number ≥ 1.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    const publicId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      + '-' + Math.random().toString(36).slice(2, 7);

    const newJob = {
      id:          'job-' + Date.now(),
      publicId,
      title:       title.trim(),
      description: description.trim(),
      department,
      location:    location.trim() || 'Remote',
      type:        jobType,
      postedDate:  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      keywords:    keywords.split(',').map((k) => k.trim()).filter(Boolean),
      threshold:   Number(threshold),
      topN:        Number(topN),
      status:      'OPEN',
      interviewDetails: null,
      applicants:  [],
    };

    const saved    = localStorage.getItem('hs_jobs');
    const existing = saved ? JSON.parse(saved) : mockJobs;
    localStorage.setItem('hs_jobs', JSON.stringify([newJob, ...existing]));
    setNewPublicId(publicId);
    setSubmitted(true);
  };

  const publicLink   = `${window.location.origin}/apply/${newPublicId}`;
  const keywordList  = keywords.split(',').map((k) => k.trim()).filter(Boolean);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle(''); setDescription(''); setKeywords('');
    setThreshold('75'); setTopN('5'); setLocation('');
    setDepartment('Engineering'); setJobType('Full-time');
    setSubmitted(false); setCopied(false); setErrors({});
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <RecruiterSidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar portal="recruiter" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title="Post a Job" />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">

            {!submitted ? (
              <div className="card">
                <h2 className="section-title mb-1">New Job Posting</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Fill in the details. A unique white-labeled public application link will be generated.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

                  <Field label="Job Title *" error={errors.title}>
                    <input className={`form-input ${errors.title ? 'border-red-300' : ''}`}
                      placeholder="e.g. Senior Frontend Engineer"
                      value={title} onChange={(e) => setTitle(e.target.value)} />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Department">
                      <select className="form-input" value={department} onChange={(e) => setDepartment(e.target.value)}>
                        {['Engineering','Product','Design','Data','Marketing','Sales','Operations'].map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Job Type">
                      <select className="form-input" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                        {['Full-time','Part-time','Contract','Internship'].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Location">
                    <input className="form-input" placeholder="e.g. Remote / San Francisco, CA"
                      value={location} onChange={(e) => setLocation(e.target.value)} />
                  </Field>

                  <Field label="Job Description *" error={errors.description}>
                    <textarea className={`form-input resize-none ${errors.description ? 'border-red-300' : ''}`}
                      rows={4} placeholder="Describe the role, responsibilities, and requirements..."
                      value={description} onChange={(e) => setDescription(e.target.value)} />
                  </Field>

                  <Field label="Required Keywords / Skills *"
                    hint="Comma-separated — the AI engine uses these to calculate applicant match %."
                    error={errors.keywords}>
                    <input className={`form-input ${errors.keywords ? 'border-red-300' : ''}`}
                      placeholder="e.g. React, TypeScript, Node.js, REST APIs"
                      value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                  </Field>

                  {keywordList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {keywordList.map((k) => <span key={k} className="badge badge-blue">{k}</span>)}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="AI Threshold % *" hint="Min score to be considered." error={errors.threshold}>
                      <input type="number" min="1" max="100"
                        className={`form-input ${errors.threshold ? 'border-red-300' : ''}`}
                        placeholder="e.g. 75"
                        value={threshold} onChange={(e) => setThreshold(e.target.value)} />
                    </Field>
                    <Field label="Top N for Interview *" hint="Max candidates to shortlist." error={errors.topN}>
                      <input type="number" min="1"
                        className={`form-input ${errors.topN ? 'border-red-300' : ''}`}
                        placeholder="e.g. 5"
                        value={topN} onChange={(e) => setTopN(e.target.value)} />
                    </Field>
                  </div>

                  <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 text-sm text-brand-700">
                    <strong>Shortlisting logic:</strong> When you close this job, the AI will filter
                    applicants with score ≥ <strong>{threshold || '?'}%</strong>, sort highest first,
                    and select the top <strong>{topN || '?'}</strong> → <strong>SHORTLISTED</strong>.
                    Others → <strong>REJECTED</strong>.
                  </div>

                  <button type="submit" className="btn-primary w-full py-3">
                    Publish Job &amp; Generate Link →
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">✅</div>
                    <h2 className="text-xl font-display font-bold">Job Published!</h2>
                  </div>
                  <p className="text-emerald-100 text-sm">
                    <strong className="text-white">"{title}"</strong> is live ·
                    Threshold <strong>{threshold}%</strong> · Top <strong>{topN}</strong> candidates
                  </p>
                </div>

                {/* Public link */}
                <div className="card border-brand-200 bg-brand-50/60">
                  <h3 className="section-title mb-1">🔗 Public Application Link</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Candidates see a clean neutral form — no HireSmart branding. Share via email, LinkedIn, WhatsApp, etc.
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 form-input bg-white font-mono text-xs text-slate-600 truncate flex items-center h-11">
                      {publicLink}
                    </div>
                    <button onClick={handleCopy}
                      className={`btn-primary shrink-0 ${copied ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleReset} className="btn-secondary flex-1">Post Another</button>
                  <button onClick={() => navigate('/recruiter/dashboard')} className="btn-primary flex-1">
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
