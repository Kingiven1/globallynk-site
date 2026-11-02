import MailingListSignup from '../components/MailingListSignup';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, buttonGhost, container, section, space, font, radius, card } from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// EDITABLE — change these and nothing else on the page needs touching.
// ──────────────────────────────────────────────────────────────────────────

// Paste your Tally application link here (https://tally.so/r/...).
// While this is empty, the Apply button is replaced by "Applications opening soon".
const APPLY_URL = 'https://tally.so/r/RWxJQJ';

// Shown to people so they know a deposit is part of the process. Leave '' to say "a small deposit".
const DEPOSIT = '$250';

// Each upcoming cohort. Add, edit or delete rows when dates are set.
// `start` can be a month ("March 2027") until you lock a date ("Sat, March 7").
const NEXT_COHORTS = [
  { city: 'Charlotte', start: 'March 2027' },
  { city: 'Washington, DC', start: 'March 2027' },
];

const STEPS = [
  { n: '01', title: 'Apply', copy: 'Applications are open year-round and free to submit. Tell us about you and pick your city.' },
  { n: '02', title: 'We review', copy: 'We read every application by hand. Expect a response within 24–48 hours.' },
  { n: '03', title: 'Get accepted', copy: 'Acceptance letter, program details and a payment link for your seat deposit land in your inbox.' },
  { n: '04', title: 'Hold your seat', copy: `Pay the ${DEPOSIT || 'small'} deposit to lock your spot, then split the rest into payments. 15 students per cohort, so seats go fast.` },
  { n: '05', title: 'Get ready', copy: 'Before class starts, we send a guide: what to expect, and where to get a controller if you need one.' },
  { n: '06', title: '8 weeks of class', copy: 'Weekly sessions, real instructors, materials and recaps after every class.' },
  { n: '07', title: 'Graduate', copy: 'Finish the program and walk away as alumni, with access to gigs and future opportunities.' },
];

const TRACKS = [
  { title: 'Corporate & Events', copy: 'DJing for private events, parties, and corporate bookings.' },
  { title: 'Radio & Streaming', copy: 'Building sets and a presence for radio and streaming platforms.' },
  { title: 'Music Production', copy: 'Producing your own tracks, not club DJing.' },
];

function ApplyButton({ style }) {
  return APPLY_URL ? (
    <a href={APPLY_URL} target="_blank" rel="noreferrer" style={{ ...buttonPrimary, ...style }}>Apply now →</a>
  ) : (
    <a href="#stay-tuned" style={{ ...buttonGhost, ...style }}>Applications opening soon. Get notified ↓</a>
  );
}

export default function Cohort() {
  return (
    <div>
      {/* ───────────── HERO ───────────── */}
      <section style={{ padding: `${space.xxl} 0 ${space.lg}` }}>
        <div
          style={{ ...container, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: space.xl, alignItems: 'center' }}
          className="lynk-cohort-hero-grid"
        >
          <div>
            <div style={eyebrow}><span>Cohort · Applications open year-round</span></div>
            <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)' }}>
              8 weeks. Small class. A real skill by graduation.
            </h1>
            <p style={{ ...bodyLg, marginTop: space.md }}>
              New cohorts start every quarter, based on the city and how many people apply.
              Apply any time. Once you're accepted, a small deposit holds your seat.
            </p>
            <div style={{ marginTop: space.lg, display: 'flex', gap: space.sm, flexWrap: 'wrap' }}>
              <ApplyButton />
              {APPLY_URL && <a href="#stay-tuned" style={buttonGhost}>Not ready? Get notified</a>}
            </div>
          </div>

          <div style={{ ...card, padding: space.lg }}>
            <div style={{ ...eyebrow, marginBottom: space.sm }}><span>Next cohorts</span></div>
            {NEXT_COHORTS.map((c, i) => (
              <div
                key={c.city}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: space.sm,
                  padding: `${space.sm} 0`,
                  borderTop: i === 0 ? 'none' : `1px solid ${color.line}`,
                }}
              >
                <span style={{ fontSize: '20px', fontWeight: 600, color: color.white }}>{c.city}</span>
                <span style={{ ...body, fontSize: '16px' }}>{c.start}</span>
              </div>
            ))}
            <p style={{ ...body, fontSize: '14px', marginTop: space.sm }}>
              More cities soon. Tell us where you are on the waitlist below.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────── QUICK FACTS ───────────── */}
      <section style={{ padding: `${space.lg} 0` }}>
        <div
          style={{
            ...container,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: space.md,
          }}
        >
          {[
            { label: 'Length', value: '8 weeks' },
            { label: 'Class size', value: '15 per cohort' },
            { label: 'Starts', value: 'Every quarter' },
            { label: 'Apply', value: 'Any time, free' },
            { label: 'Tuition', value: '$1,250' },
            { label: 'Seat', value: DEPOSIT ? `${DEPOSIT} deposit` : 'Small deposit' },
          ].map((f) => (
            <div key={f.label} style={{ borderLeft: `2px solid ${color.cyan}`, paddingLeft: space.sm }}>
              <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.mutedDim, marginBottom: '4px' }}>{f.label}</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: color.white }}>{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>How it works</span></div>
          <h2 style={{ ...h2, marginBottom: space.xl }}>From application to alumni</h2>
          <div>
            {STEPS.map((s) => (
              <div
                key={s.n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr',
                  gap: space.md,
                  padding: `${space.md} 0`,
                  borderBottom: `1px solid ${color.line}`,
                }}
              >
                <div style={{ fontFamily: font.mono, fontSize: '13px', color: color.cyanDim }}>{s.n}</div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: color.white, marginBottom: '4px' }}>{s.title}</h3>
                  <p style={{ ...body, fontSize: '15px', maxWidth: '520px' }}>{s.copy}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: space.lg }}><ApplyButton /></div>
        </div>
      </section>

      {/* ───────────── TRACKS ───────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Tracks</span></div>
          <h2 style={{ ...h2, marginBottom: space.xl }}>Choose a direction</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: space.lg }}>
            {TRACKS.map((t) => (
              <div key={t.title} style={{ ...card, padding: space.md }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: color.white, marginBottom: '8px' }}>{t.title}</h3>
                <p style={{ ...body, fontSize: '15px' }}>{t.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── WAITLIST ───────────── */}
      <section id="stay-tuned" style={{ ...section, paddingBottom: space.xxxl }}>
        <div style={{ ...container, ...card, padding: space.xl }}>
          <div style={eyebrow}><span>Not ready yet?</span></div>
          <h2 style={{ ...h2, fontSize: '30px', marginBottom: '8px' }}>Get notified when your city opens.</h2>
          <p style={{ ...body, marginBottom: space.lg }}>
            Add your email and city. We'll let you know when applications open near you and when new cohorts are announced.
          </p>
          <MailingListSignup
            heading={null}
            subtext={null}
            askCity
            cityRequired
            buttonLabel="Notify me"
            successMessage="You're on the list. We'll email you when your city opens."
          />
        </div>
      </section>

      <style>{`
        @media (max-width: 780px) {
          .lynk-cohort-hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}