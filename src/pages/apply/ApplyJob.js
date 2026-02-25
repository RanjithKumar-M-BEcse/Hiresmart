import { useState } from 'react';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC APPLY PAGE
 *
 * Accessed via /apply/:publicId
 *
 * Rules:
 *  - NO HireSmart branding
 *  - NO dashboard, NO login prompt
 *  - Completely neutral white-label appearance
 *  - Candidate only sees: "Apply for [Job Title]"
 *  - After submit: minimal neutral confirmation, no branding
 */

export default function ApplyJob() {
  const { publicId } = useParams();

  // In a real app this would be fetched from backend by publicId.
  // We show a generic job title derived from the ID for now.
  const jobTitle = publicId
    ? publicId
        .split('-')
        .slice(0, -1)   // remove the random suffix
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Open Position';

  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [resume,    setResume]    = useState(null);
  const [errors,    setErrors]    = useState({});
  const [submitting,setSubmitting]= useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF files are accepted.' }));
      return;
    }
    setErrors((prev) => ({ ...prev, resume: undefined }));
    setResume(f);
  };

  const validate = () => {
    const e = {};
    if (!name.trim())             e.name   = 'Name is required.';
    if (!email.trim())            e.email  = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';
    if (!phone.trim())            e.phone  = 'Phone number is required.';
    if (!resume)                  e.resume = 'Please upload your resume (PDF).';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // ── Submitted state — minimal, no branding ─────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-5">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Application Received</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you. Your application has been submitted successfully.
            You will be contacted if you are selected.
          </p>
        </div>
      </div>
    );
  }

  // ── Application form ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Neutral header — no branding */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-4">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Apply for {jobTitle}</h1>
          <p className="text-slate-500 text-sm mt-1">Fill in your details and upload your resume to apply.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
            <input
              className={`w-full px-4 py-3 rounded-lg border text-slate-800 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
              placeholder="e.g. Alex Johnson"
              value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address *</label>
            <input type="email"
              className={`w-full px-4 py-3 rounded-lg border text-slate-800 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
              placeholder="alex@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number *</label>
            <input
              className={`w-full px-4 py-3 rounded-lg border text-slate-800 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all ${errors.phone ? 'border-red-300' : 'border-slate-200'}`}
              placeholder="+1 415-555-0100"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Resume upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Resume *</label>
            <div className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              errors.resume ? 'border-red-300 bg-red-50' :
              resume        ? 'border-slate-300 bg-slate-50' :
                              'border-slate-200 hover:border-slate-300'}`}>
              {resume ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{resume.name}</p>
                  <p className="text-xs text-slate-400">{(resume.size / 1024).toFixed(1)} KB</p>
                  <button type="button" className="text-xs text-slate-400 hover:text-red-500 mt-1"
                    onClick={() => setResume(null)}>Remove</button>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-600">Upload your resume</p>
                  <p className="text-xs text-slate-400 mt-1">PDF only · Max 5 MB</p>
                </>
              )}
              <input type="file" accept=".pdf,application/pdf" onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </div>
            {errors.resume && <p className="text-xs text-red-500 mt-1">{errors.resume}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Submitting…
              </>
            ) : 'Submit Application'}
          </button>

          <p className="text-center text-xs text-slate-400">
            Your information is handled securely and used only for this application.
          </p>
        </form>
      </div>
    </div>
  );
}
