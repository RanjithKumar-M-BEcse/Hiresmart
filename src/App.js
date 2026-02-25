import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequirePortal, RequireRecruiterProfile } from './components/RouteGuards';

// Pages
import Login from './pages/Login';
import SelectPortal from './pages/SelectPortal';
import CompleteProfile from './pages/recruiter/CompleteProfile';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CreateJob from './pages/recruiter/CreateJob';
import JobDetail from './pages/recruiter/JobDetail';
import CandidateDashboard from './pages/candidate/Dashboard';
import CandidateAnalysis from './pages/candidate/Analysis';
import ApplyJob from './pages/apply/ApplyJob';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-portal" element={<SelectPortal />} />

          {/* Recruiter */}
          <Route
            path="/recruiter/complete-profile"
            element={
              <RequireAuth>
                <RequirePortal portal="recruiter">
                  <CompleteProfile />
                </RequirePortal>
              </RequireAuth>
            }
          />
          <Route
            path="/recruiter/dashboard"
            element={
              <RequireAuth>
                <RequirePortal portal="recruiter">
                  <RequireRecruiterProfile>
                    <RecruiterDashboard />
                  </RequireRecruiterProfile>
                </RequirePortal>
              </RequireAuth>
            }
          />
          <Route
            path="/recruiter/create-job"
            element={
              <RequireAuth>
                <RequirePortal portal="recruiter">
                  <RequireRecruiterProfile>
                    <CreateJob />
                  </RequireRecruiterProfile>
                </RequirePortal>
              </RequireAuth>
            }
          />
          <Route
            path="/recruiter/job/:id"
            element={
              <RequireAuth>
                <RequirePortal portal="recruiter">
                  <RequireRecruiterProfile>
                    <JobDetail />
                  </RequireRecruiterProfile>
                </RequirePortal>
              </RequireAuth>
            }
          />

          {/* Candidate */}
          <Route
            path="/candidate/dashboard"
            element={
              <RequireAuth>
                <RequirePortal portal="candidate">
                  <CandidateDashboard />
                </RequirePortal>
              </RequireAuth>
            }
          />
          <Route
            path="/candidate/analysis"
            element={
              <RequireAuth>
                <RequirePortal portal="candidate">
                  <CandidateAnalysis />
                </RequirePortal>
              </RequireAuth>
            }
          />

          {/* Public — no auth, no branding */}
          <Route path="/apply/:publicId" element={<ApplyJob />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
