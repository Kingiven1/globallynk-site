import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import ClassChat from '../../components/ClassChat';
import DirectMessages from '../../components/DirectMessages';
import GradientOrb from '../../components/GradientOrb';
import { color, eyebrow, h1, h2, body, card, radius, buttonPrimary, buttonGhost, container, space, font } from '../../styles/tokens';

const WEEK_OPTIONS = ['Pre-Class', 1, 2, 3, 4, 5, 6, 7, 8, 'Graduation'];

function weekValue(w) {
  if (w === 'Pre-Class') return 0;
  if (w === 'Graduation') return 9;
  return w;
}

function weekLabel(n) {
  if (n === 0) return 'Pre-Class';
  if (n === 9) return 'Graduation';
  return `Week ${n}`;
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
    <div style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xxxl}`, overflow: 'hidden' }}>
      <GradientOrb seed={27} size={480} style={{ position: 'absolute', top: '-140px', right: '-120px', zIndex: 0 }} />
      <div style={{ ...container, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={eyebrow}><span>Instructor Portal</span></div>
            <h1 style={{ ...h1, fontSize: '38px' }}>Run your class.</h1>
          </div>
          <button onClick={signOut} style={buttonGhost}>Sign out</button>
        </div>

        {cohorts.length > 0 && (
          <select
            className="lynk-input"
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
            <div style={{ ...card, padding: space.lg, marginBottom: space.lg }}>
              <h2 style={{ ...h2, fontSize: '19px', marginBottom: space.sm }}>Post a weekly update</h2>
              <form onSubmit={postMaterial} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                <select className="lynk-input" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} style={inputStyle}>
                  {WEEK_OPTIONS.map((w) => (
                    <option key={w} value={weekValue(w)}>{weekLabel(weekValue(w))}</option>
                  ))}
                </select>
                <input className="lynk-input" type="text" placeholder="Title (e.g. 'What to expect this week')" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                <textarea className="lynk-input" placeholder="Notes for this file, or a recap/announcement…" value={contentText} onChange={(e) => setContentText(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                <input type="file" onChange={(e) => setMaterialFile(e.target.files[0])} style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }} />
                <button type="submit" disabled={posting} style={{ ...buttonPrimary, justifyContent: 'center' }}>
                  {posting ? 'Posting…' : 'Post update'}
                </button>
                {message && <p style={{ fontFamily: font.body, fontSize: '13px', color: color.cyan }}>{message}</p>}
              </form>
            </div>

            <div style={{ ...card, padding: space.lg, marginBottom: space.lg }}>
              <h2 style={{ ...h2, fontSize: '19px', marginBottom: space.sm }}>Post homework</h2>
              <form onSubmit={postAssignment} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                <select className="lynk-input" value={hwWeek} onChange={(e) => setHwWeek(e.target.value)} style={inputStyle}>
                  {WEEK_OPTIONS.map((w) => (
                    <option key={w} value={weekValue(w)}>{weekLabel(weekValue(w))}</option>
                  ))}
                </select>
                <input className="lynk-input" type="text" placeholder="Assignment title" value={hwTitle} onChange={(e) => setHwTitle(e.target.value)} required style={inputStyle} />
                <textarea className="lynk-input" placeholder="Notes for this file, or instructions…" value={hwInstructions} onChange={(e) => setHwInstructions(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                <input className="lynk-input" type="date" value={hwDueDate} onChange={(e) => setHwDueDate(e.target.value)} style={inputStyle} />
                <input type="file" onChange={(e) => setHwFile(e.target.files[0])} style={{ fontFamily: font.body, fontSize: '13px', color: color.muted }} />
                <button type="submit" disabled={hwPosting} style={{ ...buttonPrimary, justifyContent: 'center' }}>
                  {hwPosting ? 'Posting…' : 'Post homework'}
                </button>
                {hwMessage && <p style={{ fontFamily: font.body, fontSize: '13px', color: color.cyan }}>{hwMessage}</p>}
              </form>
            </div>

            <h2 style={{ ...h2, fontSize: '20px', marginBottom: space.md }}>Submission status</h2>
            {assignments.length === 0 ? (
              <p style={body}>No homework posted yet.</p>
            ) : (
              assignments.map((a) => {
                const submitted = submissionsByAssignment[a.id] || new Set();
                const notSubmitted = students.filter((s) => !submitted.has(s.student_id));
                return (
                  <div key={a.id} style={{ ...card, padding: space.lg, marginBottom: space.md }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', color: color.white, marginBottom: '8px' }}>
                      {weekLabel(a.week_number)} — {a.title}
                    </h3>
                    <div style={{ display: 'inline-block', fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: color.cyan, background: color.cyanFaint, borderRadius: radius.pill, padding: '4px 12px', marginBottom: space.sm }}>
                      {submitted.size} / {students.length} submitted
                    </div>
                    {notSubmitted.length > 0 && (
                      <div>
                        <div style={{ fontFamily: font.body, fontSize: '12px', fontWeight: 600, color: '#E05252', marginBottom: '4px' }}>
                          Not submitted:
                        </div>
                        {notSubmitted.map((s) => (
                          <div key={s.student_id} style={{ fontFamily: font.body, fontSize: '14px', color: color.muted }}>
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
              <div style={{ ...card, padding: space.md }}>
                {students.map((s) => (
                  <div key={s.student_id} style={{ padding: `${space.xs} 0`, fontFamily: font.body, fontSize: '14px', color: color.muted, borderBottom: `1px solid ${color.line}` }}>
                    {s.profiles?.full_name || 'Unnamed'} — {s.profiles?.email}
                  </div>
                ))}
              </div>
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
        .lynk-input:focus {
          border-color: ${color.cyan} !important;
          box-shadow: 0 0 0 3px ${color.cyanFaint};
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  fontFamily: font.body,
  fontSize: '15px',
  color: color.white,
  background: color.bg,
  border: `1px solid ${color.line}`,
  borderRadius: radius.md,
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
};

const selectStyle = {
  ...inputStyle,
  maxWidth: '320px',
};

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