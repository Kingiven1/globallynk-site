import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import ClassChat from '../../components/ClassChat';
import { color, eyebrow, h1, h2, body, card, radius, buttonPrimary, container, space, font } from '../../styles/tokens';

export default function StudentDashboard() {
  const { profile, signOut } = useAuth();
  const [cohort, setCohort] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitText, setSubmitText] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});

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

      const { data: assigns } = await supabase
        .from('assignments')
        .select('*')
        .eq('cohort_id', enrollment.cohort_id)
        .order('week_number', { ascending: true });
      setAssignments(assigns || []);

      const { data: subs } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', profile.id);
      const subMap = {};
      (subs || []).forEach((s) => { subMap[s.assignment_id] = s; });
      setSubmissions(subMap);
    }
    setLoading(false);
  }

  async function handleSubmit(assignmentId) {
    const content = submitText[assignmentId] || '';
    if (!content.trim()) return;

    setSubmitStatus({ ...submitStatus, [assignmentId]: 'saving' });

    const { error } = await supabase.from('submissions').upsert({
      assignment_id: assignmentId,
      student_id: profile.id,
      content,
    });

    if (error) {
      setSubmitStatus({ ...submitStatus, [assignmentId]: 'error' });
      return;
    }

    setSubmitStatus({ ...submitStatus, [assignmentId]: 'done' });
    loadData();
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
            <div style={{ ...card, padding: space.md, marginTop: space.xl, marginBottom: space.xl }}>
              <h2 style={{ ...h2, fontSize: '20px', marginBottom: '4px' }}>{cohort.name}</h2>
              <p style={{ ...body, fontSize: '14px' }}>
                {cohort.meeting_day}s, {cohort.meeting_time} · {cohort.start_date} to {cohort.end_date}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: space.xl }} className="lynk-student-grid">
              <div>
                <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.md }}>Homework</h2>
                {assignments.length === 0 ? (
                  <p style={body}>No homework posted yet.</p>
                ) : (
                  assignments.map((a) => {
                    const existing = submissions[a.id];
                    const status = submitStatus[a.id];
                    return (
                      <div key={a.id} style={{ ...card, padding: space.md, marginBottom: space.md }}>
                        <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim, marginBottom: '4px' }}>
                          WEEK {a.week_number} {a.due_date ? `· Due ${a.due_date}` : ''}
                        </div>
                        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', color: color.white, marginBottom: '6px' }}>
                          {a.title}
                        </h3>
                        {a.instructions && <p style={{ ...body, fontSize: '14px', marginBottom: space.sm }}>{a.instructions}</p>}

                        {existing ? (
                          <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>✓ Submitted</p>
                        ) : (
                          <div>
                            <textarea
                              rows={3}
                              placeholder="Your response…"
                              value={submitText[a.id] || ''}
                              onChange={(e) => setSubmitText({ ...submitText, [a.id]: e.target.value })}
                              style={{
                                width: '100%',
                                fontFamily: font.body,
                                fontSize: '14px',
                                color: color.white,
                                background: color.bgRaised,
                                border: `1px solid ${color.line}`,
                                borderRadius: radius.sm,
                                padding: '10px 12px',
                                outline: 'none',
                                resize: 'vertical',
                                marginBottom: space.xs,
                              }}
                            />
                            <button onClick={() => handleSubmit(a.id)} style={buttonPrimary}>
                              {status === 'saving' ? 'Submitting…' : 'Submit'}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                <h2 style={{ ...h2, fontSize: '22px', marginTop: space.xl, marginBottom: space.md }}>Class materials</h2>
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
              </div>

              <div>
                <h2 style={{ ...h2, fontSize: '22px', marginBottom: space.md }}>Talk to your class</h2>
                <ClassChat cohortId={cohort.id} />
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lynk-student-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const signOutStyle = {
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.02em',
  color: color.mutedDim,
  background: 'none',
  border: `1px solid ${color.line}`,
  padding: '10px 16px',
  cursor: 'pointer',
};