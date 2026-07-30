import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, container, section, space, font, radius, card } from '../styles/tokens';
import cohortFlyer from '../assets/images/cohortflyer.png';

const APPLY_URL = 'https://tally.so/r/D4Ye65';

const STEPS = [
  { n: '01', title: 'Apply', copy: 'Fill out the application. Once applications close, we review manually — expect a response within 24–48 hours.' },
  { n: '02', title: 'Get accepted', copy: 'Acceptance letter, program details, and a payment link land in your inbox.' },
  { n: '03', title: 'Register & pay', copy: 'Secure your seat. 15 students per cohort, so seats go fast.' },
  { n: '04', title: 'Get ready', copy: 'Before class starts, we send a guide — what to expect, and where to get a controller if you need one.' },
  { n: '05', title: '8 weeks of class', copy: 'Weekly sessions, real instructors, materials and recaps after every class.' },
  { n: '06', title: 'Graduate', copy: 'Finish the program, walk away alumni — with access to gigs and future opportunities.' },
];

const TRACKS = [
  { title: 'Corporate & Events', copy: 'DJing for private events, parties, and corporate bookings.' },
  { title: 'Radio & Streaming', copy: 'Building sets and a presence for radio and streaming platforms.' },
  { title: 'Music Production', copy: 'Producing your own tracks — not club DJing.' },
];

export default function Cohort() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={19} size={480} style={{ position: 'absolute', top: '-140px', right: '-140px', zIndex: 0 }} />
        <div
          style={{ ...container, position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: space.xl, alignItems: 'center' }}
          className="lynk-cohort-hero-grid"
        >
          <div>
            <div style={eyebrow}><span>Cohort</span></div>
            <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)' }}>
              8 weeks. Small class. A real skill by graduation.
            </h1>
            <p style={{ ...bodyLg, marginTop: space.md }}>
              An 8-week DJ program in Charlotte, NC for beginners ready to get serious about
              their craft, brand, and career. Sept 12 – Oct 31 · Every Saturday 11AM–1PM · 15 spots.
            </p>
            <div style={{ marginTop: space.lg }}>
              <a href={APPLY_URL} target="_blank" rel="noreferrer" style={buttonPrimary}>Apply now →</a>
            </div>
          </div>
          <img
            src={cohortFlyer}
            alt="Fall 2026 DJ Cohort flyer"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: radius.lg,
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
            }}
          />
        </div>
      </section>

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
            { label: 'When', value: 'Sat, 11AM–1PM' },
            { label: 'Dates', value: 'Sept 12 – Oct 31' },
            { label: 'Class size', value: '15 spots' },
          ].map((f) => (
            <div key={f.label} style={{ borderLeft: `2px solid ${color.cyan}`, paddingLeft: space.sm }}>
              <div style={{ fontFamily: font.mono, fontSize: '11px', letterSpacing: '0.02em', color: color.mutedDim, marginBottom: '4px' }}>
                {f.label}
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', color: color.white }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>How it works</span></div>
          <h2 style={{ ...h2, marginBottom: space.xl }}>From application to alumni</h2>
          <div>
            {STEPS.map((s) => (
              <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: space.md, padding: `${space.md} 0`, borderBottom: `1px solid ${color.line}` }}>
                <div style={{ fontFamily: font.mono, fontSize: '13px', color: color.cyanDim }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '4px' }}>{s.title}</h3>
                  <p style={{ ...body, fontSize: '14px', maxWidth: '480px' }}>{s.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Tracks</span></div>
          <h2 style={{ ...h2, marginBottom: space.xl }}>Choose a direction</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: space.lg }}>
            {TRACKS.map((t) => (
              <div key={t.title} style={{ ...card, padding: space.md }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '8px' }}>{t.title}</h3>
                <p style={{ ...body, fontSize: '14px' }}>{t.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...section, paddingBottom: space.xxxl }}>
        <div style={{ ...container, ...card, padding: space.xl, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
          <div>
            <h2 style={{ ...h2, fontSize: '30px', marginBottom: '8px' }}>Applications reviewed on a rolling basis.</h2>
            <p style={body}>15 seats. Once they're gone, you're on the list for the next cohort.</p>
          </div>
          <a href={APPLY_URL} target="_blank" rel="noreferrer" style={buttonPrimary}>Apply now →</a>
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