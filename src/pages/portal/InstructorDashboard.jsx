import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import ClassChat from '../../components/ClassChat';
import DirectMessages from '../../components/DirectMessages';
import { color, eyebrow, h1, h2, body, card, buttonPrimary, buttonGhost, container, space, font } from '../../styles/tokens';

const WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 'Graduation'];

function weekValue(w) {
  return w === 'Graduation' ? 9 : w;
}

function weekLabel(n) {
  return n === 9 ? 'Graduation' : `Week ${n}`;
}

export default function InstructorDashboard() {
  const { profile, signOut } = useAuth();
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});
  const [chatMode, setChatMode] = useState('class');

  const [weekNumber, setWeekNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [materialFile, setMaterialFile] = useState(null);
  const [materialFileUrl, setMaterialFileUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  const [hwWeek, setHwWeek] = useState(1);
  const [hwTitle, setHwTitle] = useState('');
  const [hwInstructions, setHwInstructions] = useState('');
  const [hwDueDate, setHwDueDate] = useState('');
  const [hwFile, setHwFile] = useState(null);
  const [hwFileUrl, setHwFileUrl] = useState('');
  const [hwPosting, setHwPosting] = useState(false);
  const [hwMessage, setHwMessage] = useState('');

  useEffect(() => {
    loadCohorts();
  }, []);

  useEffect(() => {
    if (selectedCohort) {
      loadStudents(selectedCohort);
      loadAssignments(selectedCohort);
    }
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

  async function loadAssignments(cohortId) {
    const { data: assigns } = await supabase
      .from('assignments')
      .select('*')
      .eq('cohort_id', cohortId)
      .order('week_number', { ascending: true });
    setAssignments(assigns || []);

    if (assigns && assigns.length > 0) {
      const ids = assigns.map((a) => a.id);
      const { data: subs } = await supabase
        .from('submissions')
        .select('assignment_id, student_id')
        .in('assignment_id', ids);
      const map = {};
      (subs || []).forEach((s) => {
        if (!map[s.assignment_id]) map[s.assignment_id] = new Set();
        map[s.assignment_id].add(s.student_id);
      });
      setSubmissionsByAssignment(map);
    }
  }

  async function uploadFile(file) {
    const path = `${selectedCohort}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('course-files').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('course-files').getPublicUrl(path);
    return data.publicUrl;
  }

  async function postMaterial(e) {
    e.preventDefault();
    setPosting(true);
    setMessage('');

    let fileUrl = materialFileUrl;
    try {
      if (materialFile) {
        setMessage('Uploading file…');
        fileUrl = await uploadFile(materialFile);
      }
    } catch (err) {
      setPosting(false);
      return setMessage('File upload failed: ' + err.message);
    }

    const { error } = await supabase.from('weekly_materials').insert({
      cohort_id: selectedCohort,
      week_number: Number(weekNumber),
      title,
      content: contentText,
      file_url: fileUrl || null,
      posted_by: profile.id,
    });
    setPosting(false);
    if (error) return setMessage('Error: ' + error.message);
    setMessage('Posted.');
    setTitle('');
    setContentText('');
    setMaterialFile(null);
    setMaterialFileUrl('');
  }

  async function postAssignment(e) {
    e.preventDefault();
    setHwPosting(true);
    setHwMessage('');

    let fileUrl = hwFileUrl;
    try {
      if (hwFile) {
        setHwMessage('Uploading file…');
        fileUrl = await uploadFile(hwFile);
      }
    } catch (err) {
      setHwPosting(false);
      return setHwMessage('File upload failed: ' + err.message);
    }

    const { error } = await supabase.from('assignments').insert({
      cohort_id: selectedCohort,
      week_number: Number(hwWeek),
      title: hwTitle,
      instructions: hwInstructions,
      due_date: hwDueDate || null,
      file_url: fileUrl || null,
      posted_by: profile.id,
    });
    setHwPosting(false);
    if (error) return setHwMessage('Error: ' + error.message);
    setHwMessage('Homework posted.');
    setHwTitle('');
    setHwInstructions('');
    setHwDueDate('');
    setHwFile(null);
    setHwFileUrl('');
    loadAssignments(selectedCohort);
  }

  const roster = students.map((s) => ({
    id: s.student_id,
    name: s.profiles?.full_name || s.profiles?.email || 'Student',
  }));

  return (
    <div style={{ padding: `${space.xxl} 0 ${space.xxxl}` }}>
      <div style={container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Instructor Portal</span></div>
            <h1 style={{ ...h1, fontSize: '36px' }}>Run your class.</h1>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: space.xl, marginTop: space.lg }} className="lynk-instructor-grid">
          <div>
            <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.sm }}>Post a weekly update</h2>
            <form onSubmit={postMaterial} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, maxWidth: '520px', marginBottom: space.xl }}>
              <select value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} style={inputStyle}>
                {WEEK_OPTIONS.map((w) => (
                  <option key={w} value={weekValue(w)}>{weekLabel(weekValue(w))}</option>
                ))}
              </select>
              <input type="text" placeholder="Title (e.g. 'What to expect this week')" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
              <textarea placeholder="Notes for this file, or a recap/announcement…" value={contentText} onChange={(e) => setContentText(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: font.body }} />
              <input type="file" onChange={(e) => setMaterialFile(e.target.files[0])} style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }} />
              <button type="submit" disabled={posting} style={{ ...buttonPrimary, justifyContent: 'center' }}>
                {posting ? 'Posting…' : 'Post update'}
              </button>
              {message && <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>{message}</p>}
            </form>

            <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.sm }}>Post homework</h2>
            <form onSubmit={postAssignment} style={{ display: 'flex', flexDirection: 'column', gap: space.sm, maxWidth: '520px', marginBottom: space.xl }}>
              <select value={hwWeek} onChange={(e) => setHwWeek(e.target.value)} style={inputStyle}>
                {WEEK_OPTIONS.map((w) => (
                  <option key={w} value={weekValue(w)}>{weekLabel(weekValue(w))}</option>
                ))}
              </select>
              <input type="text" placeholder="Assignment title" value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} required style={inputStyle} />
              <textarea placeholder="Notes for this file, or instructions…" value={hwInstructions} onChange={(e) => setHwInstructions(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: font.body }} />
              <input type="date" value={hwDueDate} onChange={(e) => setHwDueDate(e.target.value)} style={inputStyle} />
              <input type="file" onChange={(e) => setHwFile(e.target.files[0])} style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }} />
              <button type="submit" disabled={hwPosting} style={{ ...buttonPrimary, justifyContent: 'center' }}>
                {hwPosting ? 'Posting…' : 'Post homework'}
              </button>
              {hwMessage && <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>{hwMessage}</p>}
            </form>

            <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.md }}>Submission status</h2>
            {assignments.length === 0 ? (
              <p style={body}>No homework posted yet.</p>
            ) : (
              assignments.map((a) => {
                const submitted = submissionsByAssignment[a.id] || new Set();
                const notSubmitted = students.filter((s) => !submitted.has(s.student_id));
                return (
                  <div key={a.id} style={{ ...card, padding: space.md, marginBottom: space.md }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '6px' }}>
                      {weekLabel(a.week_number)} — {a.title}
                    </h3>
                    <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: '8px' }}>
                      {submitted.size} / {students.length} submitted
                    </p>
                    {notSubmitted.length > 0 && (
                      <div>
                        <div style={{ fontFamily: font.mono, fontSize: '11px', color: '#E05252', marginBottom: '4px' }}>
                          Not submitted:
                        </div>
                        {notSubmitted.map((s) => (
                          <div key={s.student_id} style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }}>
                            {s.profiles?.full_name || s.profiles?.email}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}

            <h2 style={{ ...h2, fontSize: '20px', marginTop: space.xl, marginBottom: space.md }}>Enrolled students</h2>
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

          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: space.sm }}>
              <button onClick={() => setChatMode('class')} style={chatMode === 'class' ? tabActive : tabInactive}>Class Chat</button>
              <button onClick={() => setChatMode('dm')} style={chatMode === 'dm' ? tabActive : tabInactive}>Direct Messages</button>
            </div>
            {chatMode === 'class' ? (
              selectedCohort && <ClassChat cohortId={selectedCohort} />
            ) : (
              selectedCohort && <DirectMessages cohortId={selectedCohort} roster={roster} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .lynk-instructor-grid { grid-template-columns: 1fr !important; }
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

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: '10px',
  padding: '14px 16px',
  outline: 'none',
};

const selectStyle = {
  ...inputStyle,
  maxWidth: '320px',
};

const tabActive = {
  fontFamily: font.mono,
  fontSize: '12px',
  color: color.bg,
  background: color.cyan,
  border: 'none',
  borderRadius: '999px',
  padding: '8px 14px',
  cursor: 'pointer',
};

const tabInactive = {
  ...tabActive,
  color: color.muted,
  background: 'transparent',
  border: `1px solid ${color.line}`,
};