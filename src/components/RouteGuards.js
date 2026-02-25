import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export function RequirePortal({ portal, children }) {
  const { portal: activePortal } = useAuth();

  if (!activePortal) {
    return <Navigate to="/select-portal" replace />;
  }

  if (activePortal !== portal) {
    const fallback = activePortal === 'candidate' ? '/candidate/dashboard' : '/recruiter/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

export function RequireRecruiterProfile({ children }) {
  const { recruiterProfile } = useAuth();

  if (!recruiterProfile) {
    return <Navigate to="/recruiter/complete-profile" replace />;
  }

  return children;
}
