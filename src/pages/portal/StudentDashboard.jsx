import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import ClassChat from '../../components/ClassChat';
import DirectMessages from '../../components/DirectMessages';
import GradientOrb from '../../components/GradientOrb';
import GettingStarted from '../../components/GettingStarted';
import { color, eyebrow, h1, h2, body, card, radius, buttonPrimary, buttonGhost, container, space, font } from '../../styles/tokens';

function weekLabel(n) {
  if (n === 0) return 'Pre-Class';
  if (n === 9) return 'Graduation';
  return `Week ${n}`;
}

// Turns any URL sitting in plain text (like a pasted Google Drive or
// Dropbox link) into an actual clickable link, since instructors paste
// links into free-text notes fields rather than a dedicated URL field.
function Linkified(props) {
  const text = props.text || '';
  const parts = text.split(/(https?:\/\/[^\s]+)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.match(/^https?:\/\//)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noreferrer"
              style={{ color: color.cyan, wordBreak: 'break-all' }}
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function StudentDashboard() {
  const { profile, signOut } = useAuth();
  const [cohort, setCohort] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitText, setSubmitText] = useState({});
  const [submitStatus, setSubmitStatus] = useState({});
  const [chatMode, setChatMode] = useState('class');

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

      const { data: classmates } = await supabase
        .from('cohort_enrollments')
        .select('student_id, profiles(full_name, email)')
        .eq('cohort_id', enrollment.cohort_id)
        .neq('student_id', profile.id);

      const { data: instructors } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['instructor', 'admin']);

      const rosterList = [
        ...(classmates || []).map((c) => ({ id: c.student_id, name: c.profiles?.full_name || c.profiles?.email || 'Classmate' })),
        ...(instructors || []).map((i) => ({ id: i.id, name: (i.full_name || i.email) + ' (Instructor)' })),
      ];
      setRoster(rosterList);
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
    <div style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xxxl}`, overflow: 'hidden' }}>
      <GradientOrb seed={13} size={480} style={{ position: 'absolute', top: '-140px', right: '-120px', zIndex: 0 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Student Portal</span></div>
            <h1 style={{ ...h1, fontSize: '38px' }}>
              Welcome, {profile?.full_name || 'there'}.
            </h1>
          </div>
          <button onClick={signOut} style={buttonGhost}>Sign out</button>
        </div>

        {loading ? (
          <p style={{ ...body, marginTop: space.lg }}>Loading your cohort…</p>
        ) : !cohort ? (
          <p style={{ ...body, marginTop: space.lg }}>
            You're not enrolled in a cohort yet. Reach out if you think this is a mistake.
          </p>
        ) : (
          <>
            <div style={{ ...card, padding: space.lg, marginTop: space.xl, marginBottom: space.xl }}>
              <h2 style={{ ...h2, fontSize: '20px', marginBottom: '4px' }}>{cohort.name}</h2>
              <p style={{ ...body, fontSize: '14px' }}>
                {cohort.meeting_day}s, {cohort.meeting_time} · {cohort.start_date} to {cohort.end_date}
              </p>
            </div>

            <GettingStarted />

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
                      <div key={a.id} style={{ ...card, padding: space.lg, marginBottom: space.md }}>
                        <div style={{ display: 'inline-block', fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: color.cyan, background: color.cyanFaint, borderRadius: radius.pill, padding: '4px 12px', marginBottom: space.sm }}>
                          {weekLabel(a.week_number)} {a.due_date ? `· Due ${a.due_date}` : ''}
                        </div>
                        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', color: color.white, marginBottom: '6px' }}>
                          {a.title}
                        </h3>
                        {a.instructions && <p style={{ ...body, fontSize: '14px', marginBottom: space.sm }}><Linkified text={a.instructions} /></p>}
                        {a.file_url && (
                          <div style={{ display: 'flex', gap: '14px', marginBottom: space.sm }}>
                            <a href={a.file_url} target="_blank" rel="noreferrer" style={{ color: color.cyan, fontSize: '13px', fontFamily: font.body, fontWeight: 600 }}>
                              View file →
                            </a>
                            <a href={`${a.file_url}?download`} download target="_blank" rel="noreferrer" style={{ color: color.cyan, fontSize: '13px', fontFamily: font.body, fontWeight: 600 }}>
                              Download →
                            </a>
                          </div>
                        )}

                        {existing ? (
                          <p style={{ fontFamily: font.body, fontSize: '13px', fontWeight: 600, color: color.cyan }}>✓ Submitted</p>
                        ) : (
                          <div>
                            <textarea
                              className="lynk-input"
                              rows={3}
                              placeholder="Your response…"
                              value={submitText[a.id] || ''}
                              onChange={(e) => setSubmitText({ ...submitText, [a.id]: e.target.value })}
                              style={{
                                width: '100%',
                                fontFamily: font.body,
                                fontSize: '14px',
                                color: color.white,
                                background: color.bg,
                                border: `1px solid ${color.line}`,
                                borderRadius: radius.md,
                                padding: '12px 14px',
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
                    <div key={m.id} style={{ ...card, padding: space.lg, marginBottom: space.sm }}>
                      <div style={{ display: 'inline-block', fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: color.cyan, background: color.cyanFaint, borderRadius: radius.pill, padding: '4px 12px', marginBottom: space.sm }}>
                        {weekLabel(m.week_number)}
                      </div>
                      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '17px', color: color.white, marginBottom: '4px' }}>
                        {m.title}
                      </h3>
                      {m.content && <p style={{ ...body, fontSize: '14px' }}><Linkified text={m.content} /></p>}
                      {m.file_url && (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <a href={m.file_url} target="_blank" rel="noreferrer" style={{ color: color.cyan, fontSize: '13px', fontFamily: font.body, fontWeight: 600 }}>
                            View file →
                          </a>
                          <a href={`${m.file_url}?download`} download target="_blank" rel="noreferrer" style={{ color: color.cyan, fontSize: '13px', fontFamily: font.body, fontWeight: 600 }}>
                            Download →
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: space.sm }}>
                  <button onClick={() => setChatMode('class')} style={chatMode === 'class' ? tabActive : tabInactive}>Class Chat</button>
                  <button onClick={() => setChatMode('dm')} style={chatMode === 'dm' ? tabActive : tabInactive}>Direct Messages</button>
                </div>
                {chatMode === 'class' ? (
                  <ClassChat cohortId={cohort.id} />
                ) : (
                  <DirectMessages cohortId={cohort.id} roster={roster} />
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lynk-student-grid { grid-template-columns: 1fr !important; }
        }
        .lynk-input:focus {
          border-color: ${color.cyan} !important;
          box-shadow: 0 0 0 3px ${color.cyanFaint};
        }
      `}</style>
    </div>
  );
}

const tabActive = {
  fontFamily: font.body,
  fontWeight: 600,
  fontSize: '13px',
  color: color.bg,
  background: color.cyan,
  border: 'none',
  borderRadius: radius.pill,
  padding: '8px 16px',
  cursor: 'pointer',
};

const tabInactive = {
  ...tabActive,
  color: color.muted,
  background: 'transparent',
  border: `1px solid ${color.line}`,
};