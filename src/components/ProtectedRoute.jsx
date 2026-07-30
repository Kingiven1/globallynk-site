import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { color, font } from '../styles/tokens';

export default function ProtectedRoute({ children, requiredRole }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '80px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: font.mono, fontSize: '13px', color: color.mutedDim }}>Loading…</p>
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const allowed =
      profile?.role === requiredRole ||
      profile?.role === 'admin' ||
      (requiredRole === 'instructor' && profile?.role === 'instructor') ||
      (requiredRole === 'alumni' && profile?.role === 'alumni');

    if (!allowed) {
      return (
        <div style={{ padding: '80px 32px', textAlign: 'center' }}>
          <p style={{ fontFamily: font.mono, fontSize: '13px', color: color.mutedDim }}>
            You don't have access to this page.
          </p>
        </div>
      );
    }
  }

  return children;
}