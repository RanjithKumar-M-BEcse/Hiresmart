import { createContext, useContext, useState } from 'react';

/**
 * AuthContext
 *
 * Simulates Google OAuth + session-based portal selection.
 * Ready for JWT backend integration — swap the mock functions
 * with real API calls when backend is ready.
 *
 * Storage strategy:
 *   - user (logged in):  localStorage  (survives refresh, like "remember me")
 *   - portal (role):     sessionStorage (cleared on tab close — session-based)
 *   - recruiterProfile:  localStorage  (persists once completed)
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hs_user')); } catch { return null; }
  });

  const [portal, setPortal] = useState(() => {
    // Session-based: recruiter | candidate | null
    return sessionStorage.getItem('hs_portal') || null;
  });

  const [recruiterProfile, setRecruiterProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hs_recruiter_profile')); } catch { return null; }
  });

  // ── Google login (mock — replace with real OAuth) ──────────────────────────
  const loginWithGoogle = () => {
    const mockUser = {
      id:     'user-001',
      name:   'Alex Johnson',
      email:  'alex@gmail.com',
      avatar: 'AJ',
    };
    localStorage.setItem('hs_user', JSON.stringify(mockUser));
    setUser(mockUser);
    // Clear any previous session portal so user always picks fresh
    sessionStorage.removeItem('hs_portal');
    setPortal(null);
  };

  // ── Portal selection (session-based) ───────────────────────────────────────
  const selectPortal = (p) => {
    sessionStorage.setItem('hs_portal', p);
    setPortal(p);
  };

  // ── Save recruiter profile ─────────────────────────────────────────────────
  const saveRecruiterProfile = (data) => {
    const profile = { ...data, completedAt: new Date().toISOString() };
    localStorage.setItem('hs_recruiter_profile', JSON.stringify(profile));
    setRecruiterProfile(profile);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('hs_user');
    sessionStorage.removeItem('hs_portal');
    setUser(null);
    setPortal(null);
  };

  const isProfileComplete = !!recruiterProfile;

  return (
    <AuthContext.Provider value={{
      user,
      portal,
      recruiterProfile,
      isProfileComplete,
      loginWithGoogle,
      selectPortal,
      saveRecruiterProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
