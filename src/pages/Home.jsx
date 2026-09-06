import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import heroPhoto from '../assets/images/481A8469.jpg';
import winnersPhoto from '../assets/images/winners.jpg';
import workshopFlyer from '../assets/images/workshopflyer.png';
import dcWorkshopFlyer from '../assets/images/dcworkshopflyer.png';
import {
  color, eyebrow, h1, h2, bodyLg, body, card, radius,
  buttonPrimary, buttonGhost, container, section, space, font,
} from '../styles/tokens';

const RADIO_VOLUMES = [
  { vol: '006', artist: 'Jarzu', genres: 'Afrohouse, Latin, Soca', href: 'https://www.patreon.com/globallynk', cover: null },
  { vol: '005', artist: 'KØR!', genres: 'R&B, Soul, Funk', href: 'https://www.patreon.com/globallynk', cover: null },
  { vol: '004', artist: 'Chase That Taste', genres: '', href: 'https://youtu.be/YPM00VvEwCo', cover: 'https://img.youtube.com/vi/YPM00VvEwCo/hqdefault.jpg' },
  { vol: '003', artist: 'DJ Jahmaka', genres: 'Live Set', href: 'https://www.patreon.com/globallynk', cover: null },
];

const PILLARS = [
  { n: '01', title: 'Learn', copy: 'Beginner-friendly Intro Workshops — hands-on sessions built for curiosity, creativity, and connection.', to: '/events', cta: 'See upcoming workshops', accent: color.cyan, gradient: `linear-gradient(135deg, ${color.cyan}, #6FE3EE)` },
  { n: '02', title: 'Grow', copy: 'Go deeper in a Multi-Week Cohort — structured learning, accountability, real skill development.', to: '/cohort', cta: 'How the cohort works', accent: color.purple, gradient: `linear-gradient(135deg, ${color.purple}, #C7A5FF)` },
  { n: '03', title: 'Stay Connected', copy: 'Graduation is the beginning. Alumni stay plugged into showcases, collaborations, and future opportunities.', to: '/alumni', cta: 'Meet our alumni', accent: color.pink, gradient: `linear-gradient(135deg, ${color.pink}, #FFA8CC)` },
  { n: '04', title: 'Discover', copy: 'DJ sets, showcases, and cultural experiences — the events that started this whole thing in the first place.', to: '/journey', cta: 'See our journey', accent: color.cyan, gradient: `linear-gradient(135deg, ${color.cyan}, #6FE3EE)` },
];

const FEATURED_WORKSHOPS = [
  {
    city: 'Charlotte, NC',
    dateLabel: 'Monthly · Next: 10/20',
    image: workshopFlyer,
    ticketUrl: 'https://posh.vip/series/intro-to-dj-workshop',
  },
  {
    city: 'Washington, DC',
    dateLabel: 'September 16',
    image: dcWorkshopFlyer,
    ticketUrl: 'https://posh.vip/e/global-lynk-intro-to-dj-workshop-dc',
  },
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

      {/* Featured: Intro to DJ Workshop — split banner, one card per city */}
      <section style={{ ...section, paddingTop: 0 }}>
        <div style={container}>
          <div style={eyebrow}><span>Most popular · Start here</span></div>
          <h2 style={{ ...h2, fontSize: 'clamp(26px, 3.5vw, 36px)', marginBottom: space.lg }}>
            Intro to DJ Workshop
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.lg }} className="lynk-featured-split">
            {FEATURED_WORKSHOPS.map((w) => (
              <div
                key={w.city}
                style={{
                  ...card,
                  padding: space.lg,
                  border: `1px solid ${color.cyanDim}`,
                  boxShadow: `0 0 0 1px ${color.cyanFaint}`,
                }}
              >
                <img
                  src={w.image}
                  alt={`Intro to DJ Workshop — ${w.city}`}
                  style={{ width: '100%', height: 'auto', borderRadius: radius.md, marginBottom: space.md }}
                />
                <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: '4px' }}>
                  {w.dateLabel}
                </div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', color: color.white, marginBottom: space.sm }}>
                  {w.city}
                </h3>
                <a href={w.ticketUrl} target="_blank" rel="noreferrer" style={{ ...buttonPrimary, justifyContent: 'center', width: '100%' }}>
                  Get tickets →
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop: space.md }}>
            <Link to="/events" style={buttonGhost}>See all dates</Link>
          </div>
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
                Two DJs earned an all-expenses-paid trip by winning a three-round competition — then spent a week learning the culture, giving back through community service, and closing it out with a DJ set of their own.
              </p>
              <Link to="/journey" style={buttonGhost}>Read the full story</Link>
            </div>
            <img
              src={winnersPhoto}
              alt="GlobalLYNK cultural exchange winners in Mexico City"
              style={{
                width: '100%',
                aspectRatio: '4/3',
                objectFit: 'cover',
                borderRadius: radius.lg,
              }}
            />
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Let's Lynk Radio</span></div>
          <h2 style={{ ...h2, maxWidth: '640px', marginBottom: '8px' }}>Exclusive sets from the GlobalLYNK community and beyond.</h2>
          <p style={{ ...body, marginBottom: space.xl }}>New volumes drop regularly — full sets, artist by artist.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.md }}>
            {RADIO_VOLUMES.map((r) => {
              return (
                <a key={r.vol} href={r.href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  {r.cover ? (
                    <img
                      src={r.cover}
                      alt={`${r.artist} — Let's Lynk Radio Vol. ${r.vol}`}
                      style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: radius.md, marginBottom: '10px' }}
                    />
                  ) : (
                    <div style={{ aspectRatio: '1/1', background: color.bgRaised, border: `1px solid ${color.line}`, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: '11px', color: color.mutedDim, marginBottom: '10px' }}>
                      Cover art coming soon
                    </div>
                  )}
                  <div style={{ fontFamily: font.mono, fontSize: '11px', color: color.cyanDim, marginBottom: '4px' }}>VOL. {r.vol}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '2px' }}>{r.artist}</div>
                  <div style={{ ...body, fontSize: '13px' }}>{r.genres}</div>
                </a>
              );
            })}
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
          .lynk-featured-split { grid-template-columns: 1fr !important; }
        }
        .lynk-pillar-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}