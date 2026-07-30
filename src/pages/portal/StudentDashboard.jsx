import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { color, eyebrow, h1, h2, body, container, space, font } from '../../styles/tokens';

export default function StudentDashboard() {
  const { profile, signOut } = useAuth();
  const [cohort, setCohort] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: enrollment } = await supabase
      .from('cohort_enrollments')
      .select('cohort_id, cohorts(*)')
      .eq('student_id', profile.id)
      .single();

    if (enrollment?.cohorts) {
      setCohort(enrollment.cohorts);
      const { data: mats } = await supabase
        .from('weekly_materials')
        .select('*')
        .eq('cohort_id', enrollment.cohort_id)
        .order('week_number', { ascending: true });
      setMaterials(mats || []);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: `${space.xxl} 0 ${space.xxxl}` }}>
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Student Portal</span></div>
            <h1 style={{ ...h1, fontSize: '36px' }}>
              Welcome, {profile?.full_name || 'there'}.
            </h1>
          </div>
          <button onClick={signOut} style={signOutStyle}>Sign out</button>
        </div>

        {loading ? (
          <p style={{ ...body, marginTop: space.lg }}>Loading your cohort…</p>
        ) : !cohort ? (
          <p style={{ ...body, marginTop: space.lg }}>
            You're not enrolled in a cohort yet. Reach out if you think this is a mistake.
          </p>
        ) : (
          <>
            <div style={{ border: `1px solid ${color.line}`, padding: space.md, marginTop: space.xl, marginBottom: space.xl }}>
              <h2 style={{ ...h2, fontSize: '20px', marginBottom: '4px' }}>{cohort.name}</h2>
              <p style={{ ...body, fontSize: '14px' }}>
                {cohort.meeting_day}s, {cohort.meeting_time} · {cohort.start_date} to {cohort.end_date}
              </p>
            </div>

            <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.md }}>Class materials</h2>
            {materials.length === 0 ? (
              <p style={body}>Nothing posted yet — check back after your first class.</p>
            ) : (
              materials.map((m) => (
                <div key={m.id} style={{ borderBottom: `1px solid ${color.line}`, padding: `${space.sm} 0` }}>
                  <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim, marginBottom: '4px' }}>
                    WEEK {m.week_number}
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', color: color.white, marginBottom: '4px' }}>
                    {m.title}
                  </h3>
                  {m.content && <p style={{ ...body, fontSize: '14px' }}>{m.content}</p>}
                  {m.file_url && (
                    <a href={m.file_url} target="_blank" rel="noreferrer" style={{ color: color.cyan, fontSize: '13px', fontFamily: font.mono }}>
                      View file →
                    </a>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}

const signOutStyle = {
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.05em',
  color: color.mutedDim,
  background: 'none',
  border: `1px solid ${color.line}`,
  padding: '10px 16px',
  cursor: 'pointer',
};