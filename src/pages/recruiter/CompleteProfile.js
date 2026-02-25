import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Field defined OUTSIDE to prevent focus-loss bug
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

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { saveRecruiterProfile, user } = useAuth();

  const [companyName,    setCompanyName]    = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [designation,    setDesignation]    = useState('');
  const [companyLocation,setCompanyLocation]= useState('');
  const [phone,          setPhone]          = useState('');
  const [errors,         setErrors]         = useState({});

  const validate = () => {
    const e = {};
    if (!companyName.trim())     e.companyName     = 'Company name is required.';
    if (!designation.trim())     e.designation     = 'Your designation is required.';
    if (!companyLocation.trim()) e.companyLocation = 'Company location is required.';
    if (!phone.trim())           e.phone           = 'Phone number is required.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    saveRecruiterProfile({ companyName, companyWebsite, designation, companyLocation, phone });
    navigate('/recruiter/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">H</span>
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-brand-600">Hire</span><span className="text-slate-900">Smart</span>
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Complete Your Profile</h1>
          <p className="text-slate-500 text-sm mt-2">
            Set up your recruiter profile before accessing the dashboard.
            <br />
            <span className="text-slate-400">This is a one-time setup.</span>
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {/* User info chip */}
          {user && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50 border border-brand-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold">{user.avatar}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <span className="ml-auto badge badge-blue">Recruiter</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">

            <Field label="Company Name *" error={errors.companyName}>
              <input className={`form-input ${errors.companyName ? 'border-red-300' : ''}`}
                placeholder="e.g. Acme Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)} />
            </Field>

            <Field label="Company Website" hint="Optional">
              <input className="form-input"
                placeholder="https://yourcompany.com"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)} />
            </Field>

            <Field label="Your Designation *" error={errors.designation}>
              <input className={`form-input ${errors.designation ? 'border-red-300' : ''}`}
                placeholder="e.g. HR Manager, Talent Acquisition Lead"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)} />
            </Field>

            <Field label="Company Location *" error={errors.companyLocation}>
              <input className={`form-input ${errors.companyLocation ? 'border-red-300' : ''}`}
                placeholder="e.g. San Francisco, CA"
                value={companyLocation}
                onChange={(e) => setCompanyLocation(e.target.value)} />
            </Field>

            <Field label="Phone Number *" error={errors.phone}>
              <input className={`form-input ${errors.phone ? 'border-red-300' : ''}`}
                placeholder="+1 415-555-0100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} />
            </Field>

            <div className="pt-2">
              <button type="submit" className="btn-primary w-full py-3">
                Save Profile & Continue →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
