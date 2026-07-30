import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, body, buttonPrimary, buttonGhost, container, section, space, font, radius } from '../styles/tokens';
import cohortFlyer from '../assets/images/cohortflyer.png';
import workshopFlyer from '../assets/images/workshopflyer.png';
import prismFlyer from '../assets/images/prism.png';

const EVENTS = [
  {
    date: 'SEP 12',
    type: 'Cohort',
    title: 'Fall 2026 DJ Cohort Begins',
    copy: '8 weeks, Saturdays 11AM–1PM, Charlotte. Applications open now — 15 spots.',
    poshUrl: '/cohort',
    internal: true,
    image: cohortFlyer,
  },
  {
    date: 'MONTHLY',
    type: 'Workshop',
    title: 'Intro to DJ Workshop',
    copy: 'Beginner-friendly, hands-on sessions in Charlotte, NC. Next dates: 8/18, 9/15, 10/20, 11/17, 12/15. No experience or gear required.',
    poshUrl: 'https://posh.vip/series/intro-to-dj-workshop',
    image: workshopFlyer,
  },
  {
    date: 'UPCOMING',
    type: 'Dance Night',
    title: 'Prism Social — Global Dance',
    copy: 'A night of sets from GlobalLYNK DJs. Open to everyone, no experience needed to attend.',
    poshUrl: 'https://posh.vip/e/prism-social-global-dance-',
    image: prismFlyer,
  },
];

export default function Events() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={13} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Events</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '760px' }}>
            Workshops, dance nights, and everything else we've got going on.
          </h1>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
            {EVENTS.map((ev, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr auto',
                  gap: space.lg,
                  alignItems: 'center',
                  padding: space.md,
                  background: color.bgRaised,
                  border: `1px solid ${color.line}`,
                  borderRadius: radius.lg,
                }}
                className="lynk-event-row"
              >
                {ev.image ? (
                  <img
                    src={ev.image}
                    alt={ev.title}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'top', borderRadius: radius.md }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '3/4',
                      background: color.bgRaised2,
                      borderRadius: radius.md,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: font.mono,
                      fontSize: '10px',
                      color: color.mutedDim,
                      textAlign: 'center',
                    }}
                  >
                    Flyer
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: font.mono, fontSize: '11px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: '6px' }}>
                    {ev.date} · {ev.type}
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', color: color.white, marginBottom: '6px' }}>
                    {ev.title}
                  </h3>
                  <p style={{ ...body, maxWidth: '520px' }}>{ev.copy}</p>
                </div>
                {ev.internal ? (
                  <a href={ev.poshUrl} style={buttonGhost}>Learn more</a>
                ) : (
                  <a href={ev.poshUrl} target="_blank" rel="noreferrer" style={buttonPrimary}>RSVP on Posh →</a>
                )}
              </div>
            ))}
          </div>

          <p style={{ ...body, marginTop: space.lg, fontSize: '13px' }}>
            More events posted regularly — follow{' '}
            <a href="https://instagram.com/globallynk" target="_blank" rel="noreferrer" style={{ color: color.cyan, textDecoration: 'none' }}>
              @globallynk
            </a>{' '}
            for the latest.
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .lynk-event-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}