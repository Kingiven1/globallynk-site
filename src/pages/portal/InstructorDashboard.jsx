import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { color, eyebrow, h1, h2, body, buttonPrimary, container, space, font } from '../../styles/tokens';

export default function InstructorDashboard() {
  const { profile, signOut } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [students, setStudents] = useState([]);
  const [weekNumber, setWeekNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCohorts();
  }, []);

  useEffect(() => {
    if (selectedCohort) loadStudents(selectedCohort);
  }, [selectedCohort]);

  async function loadCohorts() {
    const { data } = await supabase.from('cohorts').select('*').order('start_date', { ascending: false });
    setCohorts(data || []);
    if (data?.length) setSelectedCohort(data[0].id);
  }

  async function loadStudents(cohortId) {
    const { data } = await supabase
      .from('cohort_enrollments')
      .select('student_id, profiles(full_name, email)')
      .eq('cohort_id', cohortId);
    setStudents(data || []);
  }

  async function postMaterial(e) {
    e.preventDefault();
    setPosting(true);
    setMessage('');
    const { error } = await supabase.from('weekly_materials').insert({
      cohort_id: selectedCohort,
      week_number: Number(weekNumber),
      title,
      content: contentText,
      posted_by: profile.id,
    });
    setPosting(false);
    if (error) return setMessage('Error: ' + error.message);
    setMessage('Posted.');
    setTitle('');
    setContentText('');
  }

  return (
    <div style={{ padding: `${space.xxl} 0 ${space.xxxl}` }}>
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Instructor Portal</span></div>
            <h1 style={{ ...h1, fontSize: '36px' }}>Post an update.</h1>
          </div>
          <button onClick={signOut} style={signOutStyle}>Sign out</button>
        </div>

        {cohorts.length > 0 && (
          <select
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            style={{ ...selectStyle, marginTop: space.lg }}
          >
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}

        <form onSubmit={postMaterial} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, maxWidth: '520px', marginTop: space.lg }}>
          <input
            type="number"
            placeholder="Week number"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Title (e.g. 'What to expect this week')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
          <textarea
            placeholder="Recap, homework, or announcement…"
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            rows={5}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: font.body }}
          />
          <button type="submit" disabled={posting} style={{ ...buttonPrimary, justifyContent: 'center' }}>
            {posting ? 'Posting…' : 'Post update'}
          </button>
          {message && <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>{message}</p>}
        </form>

        <h2 style={{ ...h2, fontSize: '20px', marginTop: space.xxl, marginBottom: space.md }}>Enrolled students</h2>
        {students.length === 0 ? (
          <p style={body}>No students enrolled in this cohort yet.</p>
        ) : (
          students.map((s) => (
            <div key={s.student_id} style={{ borderBottom: `1px solid ${color.line}`, padding: `${space.xs} 0`, fontFamily: font.body, fontSize: '14px', color: color.muted }}>
              {s.profiles?.full_name || 'Unnamed'} — {s.profiles?.email}
            </div>
          ))
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

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: '4px',
  padding: '14px 16px',
  outline: 'none',
};

const selectStyle = {
  ...inputStyle,
  maxWidth: '320px',
};