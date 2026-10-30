import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import heroPhoto from '../assets/images/481A8469.jpg';
import winnersPhoto from '../assets/images/winners.jpg';
import {
  color, eyebrow, h1, h2, bodyLg, body, card, radius,
  buttonPrimary, buttonGhost, container, section, space, font,
} from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// EDITABLE: "HAPPENING NOW" — the three things we want people to do right now.
// Keep it to three, ordered by deadline. When something is over, edit or swap
// its entry here; nothing else on the page needs to change.
// An action with `to` is an internal link; an action with `href` opens a new tab.
// ──────────────────────────────────────────────────────────────────────────

const HAPPENING_NOW = [
  {
    key: 'vote',
    eyebrow: 'Voting opens Tue, Nov 3 · Closes Nov 12',
    title: 'Tables Turned',
    copy: '18 DJs compete for the live finals in Charlotte. Watch the sets, then vote for one woman and one man.',
    actions: [
      { label: 'Watch & vote →', to: '/culture-exchange/vote', primary: true },
      { label: 'How it works', to: '/culture-exchange' },
    ],
  },
  {
    key: 'workshops',
    eyebrow: 'Nov 10 · Nov 12',
    title: 'Intro to DJ Workshop',
    copy: 'Beginner-friendly and hands-on. No experience or gear needed. Pick your city:',
    actions: [
      { label: 'Washington, DC · Nov 10', href: 'https://posh.vip/e/global-lynk-intro-to-dj-workshop-dc-nov-copy', primary: true },
      { label: 'Dallas · Nov 12', href: 'https://posh.vip/e/global-lynk-intro-to-dj-workshop-nov-edit-dallas-tx', primary: true },
      { label: 'See all dates', to: '/events' },
    ],
  },
  {
    key: 'mixlab',
    eyebrow: 'Art Basel · Miami · December',
    title: 'The Mix Lab',
    copy: 'A day to celebrate DJ culture, community and creative entrepreneurs. Businesses can join as Community Partners.',
    actions: [
      { label: 'Explore The Mix Lab →', to: '/mix-lab', primary: true },
      { label: 'Become a partner', to: '/mix-lab/partner-application' },
    ],
  },
];

const PILLARS = [
  { n: '01', title: 'Learn', copy: 'Beginner-friendly workshops. No experience needed.', to: '/events', cta: 'Upcoming workshops', accent: color.cyan },
  { n: '02', title: 'Grow', copy: 'An 8-week cohort with real instructors and a real skill by graduation.', to: '/cohort', cta: 'How the cohort works', accent: color.purple },
  { n: '03', title: 'Stay connected', copy: 'Alumni stay plugged into showcases, collaborations and gigs.', to: '/alumni', cta: 'Meet the DJs', accent: color.pink },
  { n: '04', title: 'Discover', copy: 'DJ sets, showcases and cultural exchanges around the world.', to: '/journey', cta: 'Our journey', accent: color.cyan },
];

function Action({ a }) {
  const style = a.primary
    ? { ...buttonPrimary, justifyContent: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box' }
    : { ...buttonGhost, justifyContent: 'center', textDecoration: 'none', width: '100%', boxSizing: 'border-box' };
  return a.href ? (
    <a href={a.href} target="_blank" rel="noreferrer" style={style}>{a.label}</a>
  ) : (
    <Link to={a.to} style={style}>{a.label}</Link>
  );
}

export default function Home() {
  return (
    <div>
      {/* ───────────── HERO ───────────── */}
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xl}`, overflow: 'hidden' }}>
        <GradientOrb seed={3} size={560} style={{ position: 'absolute', top: '-160px', right: '-120px', zIndex: 0 }} />
        <div
          style={{ ...container, position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: space.xl, alignItems: 'center' }}
          className="lynk-hero-grid"
        >
          <div>
            <div style={eyebrow}><span>Now on tour — Charlotte · DC · Dallas &amp; more</span></div>
            <h1 style={{ ...h1, fontSize: 'clamp(36px, 5.5vw, 68px)' }}>
              Where music, culture &amp; <span style={{ color: color.cyan }}>creative community grow together.</span>
            </h1>
            <p style={{ ...bodyLg, marginTop: space.md }}>
              DJ sets, hands-on workshops, and community experiences designed to spark
              creativity, build real skills, and keep people connected long after the first event.
            </p>
            <div style={{ display: 'flex', gap: space.sm, marginTop: space.lg, flexWrap: 'wrap' }}>
              <Link to="/events" style={buttonPrimary}>See upcoming events →</Link>
              <Link to="/cohort" style={buttonGhost}>Explore the cohort</Link>
            </div>
          </div>

          <img
            src={heroPhoto}
            alt="GlobalLYNK DJ"
            style={{
              width: '100%',
              aspectRatio: '4/5',
              objectFit: 'cover',
              borderRadius: radius.lg,
              boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
            }}
          />
        </div>
      </section>

      {/* ───────────── HAPPENING NOW ───────────── */}
      <section style={{ ...section, paddingTop: 0 }}>
        <div style={container}>
          <div style={eyebrow}><span>Happening now</span></div>
          <h2 style={{ ...h2, fontSize: 'clamp(26px, 3.5vw, 36px)', marginBottom: space.lg }}>
            Three ways to plug in.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: space.lg }}>
            {HAPPENING_NOW.map((item) => (
              <div
                key={item.key}
                style={{
                  ...card,
                  padding: space.lg,
                  display: 'flex',
                  flexDirection: 'column',
                  border: `1px solid ${color.cyanDim}`,
                }}
              >
                <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: '8px' }}>
                  {item.eyebrow}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '26px', color: color.white, marginBottom: '10px' }}>
                  {item.title}
                </h3>
                <p style={{ ...body, marginBottom: space.md, flex: 1 }}>{item.copy}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {item.actions.map((a) => <Action key={a.label} a={a} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── WHAT WE DO ───────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>What we do</span></div>
          <h2 style={{ ...h2, maxWidth: '640px', marginBottom: space.lg }}>Try DJing once. Go deeper if it's for you.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: space.lg }} className="lynk-pillars-grid">
            {PILLARS.map((p) => (
              <div key={p.n} style={{ borderTop: `2px solid ${p.accent}`, paddingTop: space.sm }}>
                <div style={{ fontFamily: font.mono, fontSize: '12px', color: p.accent, marginBottom: '6px' }}>{p.n}</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', color: color.white, marginBottom: '6px' }}>{p.title}</h3>
                <p style={{ ...body, fontSize: '14px', marginBottom: '10px' }}>{p.copy}</p>
                <Link to={p.to} style={{ fontFamily: font.mono, fontSize: '12px', color: p.accent, textDecoration: 'none' }}>
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── OUR STORY ───────────── */}
      <section style={{ ...section, paddingBottom: space.xxxl }}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: space.xl, alignItems: 'center' }} className="lynk-cultural-grid">
            <div>
              <div style={eyebrow}><span>GlobalLYNK Nonprofit</span></div>
              <h2 style={{ ...h2, marginBottom: space.md }}>Our first cultural exchange took students to Mexico City.</h2>
              <p style={{ ...bodyLg, marginBottom: space.md }}>
                Two DJs earned an all-expenses-paid trip by winning a three-round competition — then spent a week learning the culture, giving back through community service, and closing it out with a DJ set of their own.
              </p>
              <Link to="/journey" style={buttonGhost}>Read the full story</Link>
            </div>
            <img
              src={winnersPhoto}
              alt="GlobalLYNK cultural exchange winners in Mexico City"
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: radius.lg }}
            />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .lynk-pillars-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 780px) {
          .lynk-cultural-grid { grid-template-columns: 1fr !important; }
          .lynk-hero-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 520px) {
          .lynk-pillars-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}