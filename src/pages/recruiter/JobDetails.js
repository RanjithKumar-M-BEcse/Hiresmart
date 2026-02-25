import { useState } from 'react';
import { useParams } from 'react-router-dom';
import RecruiterLayout from '../../components/RecruiterLayout';
import { loadJobs, saveJobs } from '../../data/mockData';

// ── Close Job Modal ───────────────────────────────────────────────────────────
function CloseJobModal({ job, onClose, onConfirm }) {
  const [date,    setDate]    = useState('');
  const [time,    setTime]    = useState('');
  const [address, setAddress] = useState('');
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  const validate = () => {
    const e = {};
    if (!date.trim())    e.date    = 'Interview date is required.';
    if (!time.trim())    e.time    = 'Interview time is required.';
    if (!address.trim()) e.address = 'Interview address is required.';
    return e;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setTimeout(() => { setSaving(false); onConfirm({ date, time, address }); }, 800);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-md" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="section-title">Close Job & Schedule Interview</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-5">
            <p className="text-sm font-semibold text-amber-800 mb-1">⚠ What happens when you close this job?</p>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Applications will stop being accepted</li>
              <li>• Top {job.topN} candidates scoring ≥ {job.threshold}% will be SHORTLISTED</li>
              <li>• Others will be REJECTED</li>
              <li>• Emails will be sent automatically (backend)</li>
            </ul>
          </div>

          <form onSubmit={handleConfirm} className="space-y-4" autoComplete="off">
            <div>
              <label className="form-label">Interview Date *</label>
              <input type="date" className={`form-input ${errors.date ? 'form-input-err' : ''}`}
                value={date} onChange={e => setDate(e.target.value)} />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>
            <div>
              <label className="form-label">Interview Time *</label>
              <input type="time" className={`form-input ${errors.time ? 'form-input-err' : ''}`}
                value={time} onChange={e => setTime(e.target.value)} />
              {errors.time && <p className="form-error">{errors.time}</p>}
            </div>
            <div>
              <label className="form-label">Interview Address / Link *</label>
              <input className={`form-input ${errors.address ? 'form-input-err' : ''}`}
                placeholder="e.g. 123 Main St, NY or https://meet.google.com/abc"
                value={address} onChange={e => setAddress(e.target.value)} />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-danger flex-1" disabled={saving}>
                {saving ? <><span className="spinner !border-t-red-600 !border-red-200" /> Closing…</> : 'Confirm & Close Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Match Bar ─────────────────────────────────────────────────────────────────
function MatchBar({ pct }) {
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400';
  const text  = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-blue-600' : pct >= 40 ? 'text-amber-600' : 'text-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full progress-bar ${color}`} style={{ width:`${pct}%` }} />
      </div>
      <span className={`text-sm font-bold w-10 text-right shrink-0 ${text}`}>{pct}%</span>
    </div>
  );
}

// ── Job Details ───────────────────────────────────────────────────────────────
export default function JobDetails() {
  const { id } = useParams();
  const [jobs, setJobs]         = useState(() => loadJobs());
  const [showClose, setShowClose] = useState(false);

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <RecruiterLayout title="Job Not Found">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-slate-700">This job doesn't exist or was deleted.</p>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  // Compute statuses driven by threshold + topN
  const sorted = [...(job.applicants ?? [])].sort((a, b) => b.match - a.match);
  const qualifying = sorted.filter(a => a.match >= job.threshold);

  const enriched = sorted.map((a, idx) => {
    if (job.status === 'CLOSED') {
      const rank = qualifying.findIndex(q => q.id === a.id);
      const shortlisted = rank !== -1 && rank < job.topN;
      return { ...a, status: shortlisted ? 'SHORTLISTED' : 'REJECTED' };
    }
    return { ...a, status: 'EVALUATED' };
  });

  const shortlistedCount = enriched.filter(a => a.status === 'SHORTLISTED').length;

  const handleCloseJob = (interviewDetails) => {
    const updated = jobs.map(j => {
      if (j.id !== id) return j;
      // Apply shortlisting logic
      const sorted2 = [...j.applicants].sort((a, b) => b.match - a.match);
      const qualifying2 = sorted2.filter(a => a.match >= j.threshold);
      const newApps = sorted2.map((a, idx) => {
        const rank = qualifying2.findIndex(q => q.id === a.id);
        const sl   = rank !== -1 && rank < j.topN;
        return { ...a, status: sl ? 'SHORTLISTED' : 'REJECTED' };
      });
      return { ...j, status: 'CLOSED', interviewDetails, applicants: newApps };
    });
    setJobs(updated);
    saveJobs(updated);
    setShowClose(false);
  };

  const statusBadge = (s) => {
    if (s === 'SHORTLISTED') return 'badge-green';
    if (s === 'REJECTED')    return 'badge-red';
    return 'badge-blue';
  };

  return (
    <RecruiterLayout title={job.title}>
      <div className="p-8 space-y-6">

        {/* Job header card */}
        <div className="card anim-up">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="page-title">{job.title}</h1>
                <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-slate'}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="badge badge-slate">{job.location}</span>
                <span className="badge badge-slate">{job.type}</span>
                <span className="badge badge-amber">Threshold: {job.threshold}%</span>
                <span className="badge badge-violet">Top {job.topN} for interview</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              {job.status === 'OPEN' ? (
                <button onClick={() => setShowClose(true)} className="btn-danger whitespace-nowrap">
                  🔒 Close Job
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-500">
                  <p className="font-semibold text-slate-700 mb-1">Interview Details</p>
                  <p>📅 {job.interviewDetails?.date}</p>
                  <p>⏰ {job.interviewDetails?.time}</p>
                  <p>📍 {job.interviewDetails?.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div className="divider" />
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required Keywords</p>
            <div className="flex flex-wrap gap-1.5">
              {(job.keywords ?? []).map(k => <span key={k} className="badge badge-blue">{k}</span>)}
            </div>
          </div>
        </div>

        {/* Closed banner */}
        {job.status === 'CLOSED' && (
          <div className="rounded-xl p-4 bg-slate-100 border border-slate-200 flex items-center gap-3 anim-in">
            <span className="text-xl">🔒</span>
            <div>
              <p className="font-semibold text-slate-700 text-sm">This job is closed</p>
              <p className="text-slate-500 text-xs">
                Top {job.topN} qualifying candidates have been shortlisted. Emails sent automatically.
              </p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 anim-up2">
          {[
            { label:'Total',       value:enriched.length,              color:'text-slate-900',   bg:'bg-slate-50' },
            { label:'Evaluated',   value:enriched.filter(a=>a.status==='EVALUATED').length,   color:'text-blue-600',    bg:'bg-blue-50' },
            { label:'Shortlisted', value:shortlistedCount,             color:'text-emerald-600', bg:'bg-emerald-50' },
            { label:'Rejected',    value:enriched.filter(a=>a.status==='REJECTED').length,    color:'text-red-600',     bg:'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 ${s.bg} text-center`}>
              <div className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applicants table */}
        <div className="card p-0 overflow-hidden anim-up3">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="section-title">Applicants</h2>
              <p className="text-slate-400 text-xs mt-0.5">Sorted by highest AI match · Shortlisted if score ≥ {job.threshold}%</p>
            </div>
            <span className="badge badge-slate">{enriched.length} total</span>
          </div>

          {enriched.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-slate-500 font-semibold">No applicants yet</p>
              <p className="text-slate-400 text-sm mt-1">Share the public link to start receiving applications</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-6 py-3">#</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="px-4 py-3 min-w-[180px]">Match %</th>
                    <th className="text-center px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enriched.map((a, i) => (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {a.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-semibold text-slate-900 text-sm">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 text-sm">{a.email}</td>
                      <td className="px-4 py-4">
                        <MatchBar pct={a.match} />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(a.matchedKeywords ?? []).map(k => (
                            <span key={k} className="badge badge-green" style={{fontSize:'10px',padding:'1px 6px'}}>{k}</span>
                          ))}
                          {(a.missingKeywords ?? []).map(k => (
                            <span key={k} className="badge badge-red" style={{fontSize:'10px',padding:'1px 6px'}}>{k}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`badge ${statusBadge(a.status)}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showClose && (
        <CloseJobModal
          job={job}
          onClose={() => setShowClose(false)}
          onConfirm={handleCloseJob}
        />
      )}
    </RecruiterLayout>
  );
}
