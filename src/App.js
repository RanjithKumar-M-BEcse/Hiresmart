import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login              from './pages/Login';
import SelectPortal       from './pages/SelectPortal';
import CompleteProfile    from './pages/recruiter/CompleteProfile';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CreateJob          from './pages/recruiter/CreateJob';
import JobDetail          from './pages/recruiter/JobDetail';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateAnalysis  from './pages/candidate/Analysis';
import ApplyJob           from './pages/apply/ApplyJob';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/"              element={<Login />}        />
          <Route path="/login"         element={<Login />}        />
          <Route path="/select-portal" element={<SelectPortal />} />

          {/* Recruiter */}
          <Route path="/recruiter/complete-profile" element={<CompleteProfile />}     />
          <Route path="/recruiter/dashboard"        element={<RecruiterDashboard />}  />
          <Route path="/recruiter/create-job"       element={<CreateJob />}           />
          <Route path="/recruiter/job/:id"          element={<JobDetail />}           />

          {/* Candidate */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/analysis"  element={<CandidateAnalysis />}  />

          {/* Public — no auth, no branding */}
          <Route path="/apply/:publicId" element={<ApplyJob />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
