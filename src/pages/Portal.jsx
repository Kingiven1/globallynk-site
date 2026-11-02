import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './portal/StudentDashboard';
import InstructorDashboard from './portal/InstructorDashboard';
import AlumniDashboard from './portal/AlumniDashboard';
import { color, font } from '../styles/tokens';

export default function Portal() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <div style={{ padding: '80px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: font.mono, fontSize: '13px', color: color.mutedDim }}>Setting up your account…</p>
      </div>
    );
  }

  // Mix Lab partner managers only work on partner applications.
  if (profile.role === 'partner_manager') return <Navigate to="/admin/partners" replace />;
  if (profile.role === 'instructor') return <InstructorDashboard />;
  if (profile.role === 'alumni') return <AlumniDashboard />;
  if (profile.role === 'admin') return <InstructorDashboard />;
  return <StudentDashboard />;
}