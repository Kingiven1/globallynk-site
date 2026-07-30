import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import heroPhoto from '../assets/images/481A8469.jpg';
import {
  color, eyebrow, h1, h2, bodyLg, body, card, radius,
  buttonPrimary, buttonGhost, container, section, space, font,
} from '../styles/tokens';

const RADIO_VOLUMES = [
  { vol: '006', artist: 'Jarzu', genres: 'Afrohouse, Latin, Soca', href: 'https://www.patreon.com/globallynk' },
  { vol: '005', artist: 'KØR!', genres: 'R&B, Soul, Funk', href: 'https://www.patreon.com/globallynk' },
  { vol: '004', artist: 'Chase That Taste', genres: '', href: 'https://youtu.be/YPM00VvEwCo' },
  { vol: '003', artist: 'DJ Jahmaka', genres: 'Live Set', href: 'https://www.patreon.com/globallynk' },
];

const PILLARS = [
  { n: '01', title: 'Learn', copy: 'Beginner-friendly Intro Workshops — hands-on sessions built for curiosity, creativity, and connection.', to: '/events', cta: 'See upcoming workshops', accent: color.cyan, gradient: `linear-gradient(135deg, ${color.cyan}, #6FE3EE)` },
  { n: '02', title: 'Grow', copy: 'Go deeper in a Multi-Week Cohort — structured learning, accountability, real skill development.', to: '/cohort', cta: 'How the cohort works', accent: color.purple, gradient: `linear-gradient(135deg, ${color.purple}, #C7A5FF)` },
  { n: '03', title: 'Stay Connected', copy: 'Graduation is the beginning. Alumni stay plugged into showcases, collaborations, and future opportunities.', to: '/alumni', cta: 'Meet our alumni', accent: color.pink, gradient: `linear-gradient(135deg, ${color.pink}, #FFA8CC)` },
  { n: '04', title: 'Discover', copy: 'DJ sets, showcases, and cultural experiences — the events that started this whole thing in the first place.', to: '/journey', cta: 'See our journey', accent: color.cyan, gradient: `linear-gradient(135deg, ${color.cyan}, #6FE3EE)` },
];

export default function Home() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xl}`, overflow: 'hidden' }}>
        <GradientOrb seed={3} size={560} style={{ position: 'absolute', top: '-160px', right: '-120px', zIndex: 0 }} />
        <div
          style={{ ...container, position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: space.xl, alignItems: 'center' }}
          className="lynk-hero-grid"
        >
          <div>
            <div style={eyebrow}><span>Charlotte, NC — Expanding 2026</span></div>
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

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>What we do</span></div>
          <h2 style={{ ...h2, maxWidth: '640px', marginBottom: space.xl }}>Try DJing once. Go deeper if it's for you.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.lg }} className="lynk-pillars-grid">
            {PILLARS.map((p) => (
              <div key={p.n} className="lynk-pillar-card" style={{ ...card, padding: space.lg, transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: radius.sm, background: p.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: space.md, boxShadow: `0 4px 14px ${p.accent}33` }}>
                  <span style={{ fontFamily: font.mono, fontSize: '14px', color: color.bg, fontWeight: 600 }}>{p.n}</span>
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', color: color.white, marginBottom: '10px' }}>{p.title}</h3>
                <p style={{ ...body, marginBottom: space.md }}>{p.copy}</p>
                <Link to={p.to} style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.01em', color: p.accent, textDecoration: 'none' }}>
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: space.xl, alignItems: 'center' }} className="lynk-cultural-grid">
            <div>
              <div style={eyebrow}><span>GlobalLYNK Nonprofit</span></div>
              <h2 style={{ ...h2, marginBottom: space.md }}>Our first cultural exchange took students to Mexico City.</h2>
              <p style={{ ...bodyLg, marginBottom: space.md }}>
                A week of learning the culture, eating the food, and living it — capped off with our students playing a DJ set of their own. This is the nonprofit side of GlobalLYNK: creativity as a bridge, not just a skill.
              </p>
              <Link to="/journey" style={buttonGhost}>Read the full story</Link>
            </div>
            <div style={{ aspectRatio: '4/3', background: color.bgRaised, border: `1px solid ${color.line}`, borderRadius: radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: '12px', color: color.mutedDim, letterSpacing: '0.05em' }}>
              Mexico City photo coming soon
            </div>
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Let's Lynk Radio</span></div>
          <h2 style={{ ...h2, maxWidth: '640px', marginBottom: '8px' }}>Exclusive sets from the GlobalLYNK community and beyond.</h2>
          <p style={{ ...body, marginBottom: space.xl }}>New volumes drop regularly — full sets, artist by artist.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.md }}>
            {RADIO_VOLUMES.map((r) => (
              <a key={r.vol} href={r.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ aspectRatio: '1/1', background: color.bgRaised, border: `1px solid ${color.line}`, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: '11px', color: color.mutedDim, marginBottom: '10px' }}>
                  Cover art coming soon
                </div>
                <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim, marginBottom: '4px' }}>VOL. {r.vol}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '2px' }}>{r.artist}</div>
                <div style={{ ...body, fontSize: '13px' }}>{r.genres}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...section, paddingBottom: space.xxxl }}>
        <div style={{ ...container, ...card, padding: space.xl, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
          <div>
            <h2 style={{ ...h2, fontSize: '30px', marginBottom: '8px' }}>First workshop is the easiest way in.</h2>
            <p style={body}>One day. Try it. See where it takes you.</p>
          </div>
          <Link to="/events" style={buttonPrimary}>Find a workshop →</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 780px) {
          .lynk-cultural-grid { grid-template-columns: 1fr !important; }
          .lynk-hero-grid { grid-template-columns: 1fr !important; }
          .lynk-pillars-grid { grid-template-columns: 1fr !important; }
        }
        .lynk-pillar-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}