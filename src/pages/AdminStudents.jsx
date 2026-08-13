import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, body, card, radius, buttonPrimary, buttonGhost, container, space, font } from '../styles/tokens';

export default function AdminStudents() {
  const { profile, signOut } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile?.role === 'admin') {
      loadCohorts();
    } else {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    if (selectedCohort) loadStudents(selectedCohort);
  }, [selectedCohort]);

  async function loadCohorts() {
    const { data } = await supabase.from('cohorts').select('*').order('start_date', { ascending: false });
    setCohorts(data || []);
    if (data?.length) setSelectedCohort(data[0].id);
    setLoading(false);
  }

  async function loadStudents(cohortId) {
    const { data } = await supabase
      .from('cohort_enrollments')
      .select('id, created_at, graduated, profiles(id, full_name, email, role)')
      .eq('cohort_id', cohortId)
      .order('created_at', { ascending: true });
    setStudents(data || []);
  }

  async function handleGraduate(enrollment) {
    const studentId = enrollment.profiles?.id;
    if (!studentId) return;

    setBusyId(enrollment.id);
    setMessage('');

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'alumni' })
      .eq('id', studentId);

    if (profileError) {
      setBusyId(null);
      return setMessage('Error: ' + profileError.message);
    }

    await supabase
      .from('cohort_enrollments')
      .update({ graduated: true })
      .eq('id', enrollment.id);

    setBusyId(null);
    setMessage(`${enrollment.profiles?.full_name || 'Student'} is now an alumni.`);
    loadStudents(selectedCohort);
  }

  // Gate the whole page on admin role — self-contained, doesn't rely on
  // any external route-protection logic being correctly wired.
  if (!profile) {
    return (
      <div style={{ padding: `${space.xxl} 0`, textAlign: 'center' }}>
        <p style={body}>Loading…</p>
      </div>
    );
  }

  if (profile.role !== 'admin') {
    return (
      <div style={{ padding: `${space.xxl} 0`, textAlign: 'center' }}>
        <div style={container}>
          <div style={eyebrow}><span>Restricted</span></div>
          <h1 style={{ ...h1, fontSize: '32px' }}>Admins only.</h1>
          <p style={{ ...body, marginTop: space.sm }}>You don't have access to this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xxxl}`, overflow: 'hidden' }}>
      <GradientOrb seed={44} size={480} style={{ position: 'absolute', top: '-140px', right: '-120px', zIndex: 0 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Admin</span></div>
            <h1 style={{ ...h1, fontSize: '38px' }}>Manage students.</h1>
          </div>
          <button onClick={signOut} style={buttonGhost}>Sign out</button>
        </div>

        {cohorts.length > 0 && (
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            style={{
              marginTop: space.lg,
              maxWidth: '320px',
              fontFamily: font.body,
              fontSize: '15px',
              color: color.white,
              background: color.bg,
              border: `1px solid ${color.line}`,
              borderRadius: radius.md,
              padding: '12px 14px',
              outline: 'none',
            }}
          >
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        {message && (
          <p style={{ fontFamily: font.body, fontSize: '13px', color: color.cyan, marginTop: space.md }}>
            {message}
          </p>
        )}

        <div style={{ marginTop: space.lg }}>
          {loading ? (
            <p style={body}>Loading…</p>
          ) : students.length === 0 ? (
            <p style={body}>No students enrolled in this cohort yet.</p>
          ) : (
            students.map((enrollment) => {
              const s = enrollment.profiles;
              const isAlumni = s?.role === 'alumni';
              return (
                <div
                  key={enrollment.id}
                  style={{
                    ...card,
                    padding: space.md,
                    marginBottom: space.sm,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: space.md,
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', color: color.white, marginBottom: '2px' }}>
                      {s?.full_name || 'Unnamed'}
                    </div>
                    <div style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }}>
                      {s?.email}
                    </div>
                  </div>

                  {isAlumni ? (
                    <span
                      style={{
                        fontFamily: font.body,
                        fontWeight: 600,
                        fontSize: '13px',
                        color: color.cyan,
                        background: color.cyanFaint,
                        borderRadius: radius.pill,
                        padding: '6px 14px',
                      }}
                    >
                      Alumni
                    </span>
                  ) : (
                    <button
                      onClick={() => handleGraduate(enrollment)}
                      disabled={busyId === enrollment.id}
                      style={buttonPrimary}
                    >
                      {busyId === enrollment.id ? 'Updating…' : 'Mark as Graduated'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}