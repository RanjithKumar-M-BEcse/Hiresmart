import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RecruiterSidebar from '../../components/RecruiterSidebar';
import Navbar from '../../components/Navbar';
import { mockJobs } from '../../data/mockData';

// Status badge helper
const StatusBadge = ({ status }) => {
  const map = {
    EVALUATED:   'badge-blue',
    SHORTLISTED: 'badge-green',
    REJECTED:    'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-slate'}`}>{status}</span>;
};

// Match progress bar
const MatchBar = ({ pct }) => {
  const color =
    pct >= 80 ? 'bg-emerald-500' :
    pct >= 60 ? 'bg-brand-500'  :
    pct >= 40 ? 'bg-amber-500'  : 'bg-red-400';
  const text =
    pct >= 80 ? 'text-emerald-600' :
    pct >= 60 ? 'text-brand-600'  :
    pct >= 40 ? 'text-amber-600'  : 'text-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color} progress-bar`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-bold w-10 text-right ${text}`}>{pct}%</span>
    </div>
  );
};

// Close Job Modal
function CloseJobModal({ job, onClose, onConfirm }) {
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [address, setAddress] = useState('');
  const [errors,  setErrors]  = useState({});

  const validate = () => {
    const e = {};
    if (!date)           e.date    = 'Interview date is required.';
    if (!time)           e.time    = 'Interview time is required.';
    if (!address.trim()) e.address = 'Interview address is required.';
    return e;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onConfirm({ date, time, address });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl shrink-0">🔒</div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Close Job</h3>
            <p className="text-slate-500 text-sm mt-0.5">
              Closing <strong>"{job.title}"</strong> will trigger shortlisting.
              <br />
              Top <strong>{job.topN}</strong> candidates with score ≥ <strong>{job.threshold}%</strong> will be SHORTLISTED. Others → REJECTED.
            </p>
          </div>
        </div>

        <div className="divider" />

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="form-label">Interview Date *</label>
            <input type="date" className={`form-input ${errors.date ? 'border-red-300' : ''}`}
              value={date} onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} />
            {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="form-label">Interview Time *</label>
            <input type="time" className={`form-input ${errors.time ? 'border-red-300' : ''}`}
              value={time} onChange={(e) => setTime(e.target.value)} />
            {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="form-label">Interview Address *</label>
            <input className={`form-input ${errors.address ? 'border-red-300' : ''}`}
              placeholder="e.g. 500 Tech Plaza, San Francisco, CA"
              value={address} onChange={(e) => setAddress(e.target.value)} />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700">
            ⚠️ This action cannot be undone. Further applications will be disabled.
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all">
              🔒 Close & Shortlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('hs_jobs');
      return saved ? JSON.parse(saved) : mockJobs;
    } catch { return mockJobs; }
  });

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <RecruiterSidebar isOpen={sidebarOpen} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="font-display font-bold text-slate-800 text-xl mb-2">Job Not Found</h2>
            <button className="btn-primary mt-4" onClick={() => navigate('/recruiter/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort applicants high → low
  const sorted = [...(job.applicants || [])].sort((a, b) => b.match - a.match);

  // Close job handler
  const handleCloseJob = (interviewDetails) => {
    const threshold = job.threshold;
    const topN      = job.topN;

    // Filter eligible, sort, pick top N
    const eligible  = [...sorted].filter((a) => a.match >= threshold);
    const topIds    = new Set(eligible.slice(0, topN).map((a) => a.id));

    const updatedApplicants = sorted.map((a) => ({
      ...a,
      status: topIds.has(a.id) ? 'SHORTLISTED' : 'REJECTED',
    }));

    const updatedJob = {
      ...job,
      status: 'CLOSED',
      interviewDetails,
      applicants: updatedApplicants,
    };

    const updatedJobs = jobs.map((j) => j.id === job.id ? updatedJob : j);
    localStorage.setItem('hs_jobs', JSON.stringify(updatedJobs));
    setJobs(updatedJobs);
    setShowCloseModal(false);
  };

  const currentJob = jobs.find((j) => j.id === id);
  const currentSorted = [...(currentJob?.applicants || [])].sort((a, b) => b.match - a.match);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <RecruiterSidebar isOpen={sidebarOpen} />

      {showCloseModal && (
        <CloseJobModal
          job={currentJob}
          onClose={() => setShowCloseModal(false)}
          onConfirm={handleCloseJob}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar portal="recruiter" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={currentJob.title} />

        <main className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* Job header */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 card">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-xl">{currentJob.title}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="badge badge-blue">{currentJob.department}</span>
                    <span className="badge badge-slate">{currentJob.location}</span>
                    <span className="badge badge-slate">{currentJob.type}</span>
                    <span className={`badge ${currentJob.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>
                      {currentJob.status === 'OPEN' ? '🟢 OPEN' : '🔴 CLOSED'}
                    </span>
                  </div>
                </div>

                {/* Close Job button — only if OPEN */}
                {currentJob.status === 'OPEN' && (
                  <button onClick={() => setShowCloseModal(true)} className="btn-danger shrink-0">
                    🔒 Close Job
                  </button>
                )}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{currentJob.description}</p>

              {/* Interview details (if closed) */}
              {currentJob.status === 'CLOSED' && currentJob.interviewDetails && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-sm font-bold text-red-700 mb-2">📅 Interview Details</p>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div><p className="text-red-400 text-xs font-semibold">Date</p><p className="text-slate-800 font-semibold">{currentJob.interviewDetails.date}</p></div>
                    <div><p className="text-red-400 text-xs font-semibold">Time</p><p className="text-slate-800 font-semibold">{currentJob.interviewDetails.time}</p></div>
                    <div><p className="text-red-400 text-xs font-semibold">Address</p><p className="text-slate-800 font-semibold text-xs">{currentJob.interviewDetails.address}</p></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="card">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Stats</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Total Applicants', value: currentSorted.length,                                         color: 'text-slate-900' },
                    { label: 'Shortlisted',       value: currentSorted.filter(a=>a.status==='SHORTLISTED').length,     color: 'text-emerald-600' },
                    { label: 'Rejected',          value: currentSorted.filter(a=>a.status==='REJECTED').length,        color: 'text-red-500' },
                    { label: 'Threshold',         value: `${currentJob.threshold}%`,                                   color: 'text-amber-600' },
                    { label: 'Top N',             value: `${currentJob.topN} candidates`,                              color: 'text-violet-600' },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between">
                      <span className="text-slate-500">{s.label}</span>
                      <span className={`font-bold ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Required Keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(currentJob.keywords || []).map((k) => (
                    <span key={k} className="badge badge-blue">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Applicants table */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="section-title">Applicants</h2>
                <p className="text-sm text-slate-400 mt-0.5">
                  Sorted by match % · Shortlisted if score ≥ {currentJob.threshold}% and in top {currentJob.topN}
                </p>
              </div>
              <span className="badge badge-slate">{currentSorted.length} total</span>
            </div>

            {currentSorted.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="font-semibold">No applicants yet.</p>
                <p className="text-sm mt-1">Share the public application link to receive applications.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {currentSorted.map((a, idx) => (
                  <div key={a.id} className="px-6 py-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                      {/* Rank + identity */}
                      <div className="flex items-center gap-3 sm:w-52 shrink-0">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {a.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{a.name}</p>
                          <p className="text-xs text-slate-400 truncate">{a.email}</p>
                        </div>
                      </div>

                      {/* Match bar + keywords */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-semibold mb-1.5">AI Match Score</p>
                        <MatchBar pct={a.match} />
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {a.matchedKeywords?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-emerald-600 mb-1">✓ Matched</p>
                              <div className="flex flex-wrap gap-1">
                                {a.matchedKeywords.map((k) => <span key={k} className="badge badge-green text-xs">{k}</span>)}
                              </div>
                            </div>
                          )}
                          {a.missingKeywords?.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-red-500 mb-1">✗ Missing</p>
                              <div className="flex flex-wrap gap-1">
                                {a.missingKeywords.map((k) => <span key={k} className="badge badge-red text-xs">{k}</span>)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="shrink-0 self-start">
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
