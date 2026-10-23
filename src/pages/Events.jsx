import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, body, buttonPrimary, buttonGhost, container, section, space, font, radius } from '../styles/tokens';
import tablesTurnedFlyer from '../assets/images/tables-turned-flyer.jpg';
import workshopFlyer from '../assets/images/workshopflyer.png';
import dcWorkshopFlyer from '../assets/images/dc-nov10-flyer.jpg';
import dallasWorkshopFlyer from '../assets/images/dallas-nov12-flyer.jpg';

const EVENTS = [
  {
    date: 'VOTING CLOSES NOV 12',
    type: 'Competition',
    title: 'Tables Turned — Public Vote',
    copy: '18 DJs. One vote for a woman, one vote for a man. Watch the sets and help pick the 10 finalists headed to the live finals in Charlotte.',
    poshUrl: '/culture-exchange/vote',
    internal: true,
    ctaLabel: 'Vote now →',
    primary: true,
    image: tablesTurnedFlyer,
  },
  {
    date: 'NOV 10',
    type: 'Workshop',
    title: 'Intro to DJ Workshop — Washington, DC',
    copy: 'Learn the basics, meet working DJs, get hands-on. Led by King Iven, DJ Oowwee & DJ Popkorn. No experience or gear required.',
    poshUrl: 'https://posh.vip/e/global-lynk-intro-to-dj-workshop-dc-nov-copy',
    image: dcWorkshopFlyer,
  },
  {
    date: 'NOV 12',
    type: 'Workshop',
    title: 'Intro to DJ Workshop — Dallas, TX',
    copy: 'Learn the basics, meet working DJs, get hands-on. Led by DJ Nitecrawler & King Iven. Supported by AMP SPOT. No experience or gear required.',
    poshUrl: 'https://posh.vip/e/global-lynk-intro-to-dj-workshop-nov-edit-dallas-tx',
    image: dallasWorkshopFlyer,
  },
  {
    date: 'MONTHLY',
    type: 'Workshop',
    title: 'Intro to DJ Workshop — Charlotte, NC',
    copy: 'Beginner-friendly, hands-on sessions in Charlotte, NC. Next dates: 11/17, 12/15. No experience or gear required.',
    poshUrl: 'https://posh.vip/series/intro-to-dj-workshop',
    image: workshopFlyer,
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
                  gridTemplateColumns: '200px 1fr auto',
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
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: radius.md }}
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
                  <a href={ev.poshUrl} style={ev.primary ? buttonPrimary : buttonGhost}>{ev.ctaLabel || 'Learn more'}</a>
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