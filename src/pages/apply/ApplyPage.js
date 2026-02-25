import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadJobs } from '../../data/mockData';

// Run a mock ATS score based on resume name seed
function mockATS(name, keywords) {
  const seed = (name.length % 3);
  const matchedCounts = [keywords.length, Math.ceil(keywords.length * 0.7), Math.ceil(keywords.length * 0.4)];
  const count = matchedCounts[seed];
  const matched = keywords.slice(0, count);
  const missing = keywords.slice(count);
  const pct = Math.round((count / keywords.length) * 100);
  return { pct, matched, missing };
}

// ── File Drop Zone ────────────────────────────────────────────────────────────
function DropZone({ file, onFile, error }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') onFile(f);
  };
  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
        ${error ? 'border-red-300 bg-red-50' : file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'}
      `}
    >
      {file ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-3xl">📄</div>
          <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
          <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB · PDF</p>
          <button type="button" onClick={() => onFile(null)}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors mt-1">
            Remove
          </button>
        </div>
      ) : (
        <>
          <div className="text-3xl mb-2">☁️</div>
          <p className="text-sm font-semibold text-slate-600">Drag & drop your resume here</p>
          <p className="text-xs text-slate-400 mt-1">or click to browse · PDF only · Max 5MB</p>
        </>
      )}
      <input
        type="file" accept=".pdf,application/pdf"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={e => { const f = e.target.files[0]; if (f?.type === 'application/pdf') onFile(f); }}
      />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const { publicId } = useParams();

  // Find the job by publicId
  const jobs     = loadJobs();
  const job      = jobs.find(j => j.publicId === publicId);
  const isClosed = job?.status === 'CLOSED';

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [phone,   setPhone]   = useState('');
  const [file,    setFile]    = useState(null);
  const [errors,  setErrors]  = useState({});
  const [step,    setStep]    = useState('form'); // 'form' | 'analyzing' | 'done'

  const validate = () => {
    const e = {};
    if (!name.trim())  e.name  = 'Name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!phone.trim()) e.phone = 'Phone is required.';
    if (!file)         e.file  = 'Please upload your resume (PDF).';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isClosed) return;
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep('analyzing');
    // Simulate AI processing
    setTimeout(() => setStep('done'), 2000);
  };

  // ── Job not found ──
  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
          <p className="text-slate-500 text-sm">This application link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // ── Job closed ──
  if (isClosed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Applications Closed</h2>
          <p className="text-slate-500 text-sm">
            This position is no longer accepting applications.
          </p>
        </div>
      </div>
    );
  }

  // ── Analyzing state ──
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-slate-700 mx-auto mb-5"
            style={{ animation:'spin .8s linear infinite' }} />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Processing your application…</h2>
          <p className="text-slate-400 text-sm">Please wait, this only takes a moment.</p>
        </div>
      </div>
    );
  }

  // ── Done state — minimal, no branding ──
  if (step === 'done') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Application Submitted</h2>
          <p className="text-slate-400 text-sm">
            Thank you. You will be contacted if selected.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Minimal job header — no HireSmart branding */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
          <p className="text-slate-500 text-sm">{job.location} · {job.type}</p>
          <div className="divider" />
          <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

          {/* Name */}
          <div>
            <label className="form-label">Full Name *</label>
            <input className={`form-input ${errors.name ? 'form-input-err' : ''}`}
              placeholder="e.g. Alex Johnson"
              value={name} onChange={e => setName(e.target.value)} />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="form-label">Email Address *</label>
            <input type="email" className={`form-input ${errors.email ? 'form-input-err' : ''}`}
              placeholder="alex@email.com"
              value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="form-label">Phone Number *</label>
            <input className={`form-input ${errors.phone ? 'form-input-err' : ''}`}
              placeholder="+1 415 123 4567"
              value={phone} onChange={e => setPhone(e.target.value)} />
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </div>

          {/* Resume */}
          <div>
            <label className="form-label">Resume *</label>
            <DropZone file={file} onFile={setFile} error={errors.file} />
            {errors.file && <p className="form-error mt-1">{errors.file}</p>}
          </div>

          <button type="submit" className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 mt-2">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
