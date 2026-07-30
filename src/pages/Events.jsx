import Waveform from '../components/Waveform';
import { color, eyebrow, h1, body, buttonPrimary, buttonGhost, container, section, space, font } from '../styles/tokens';

// TODO: replace with live data — either fetch from Posh's API/embed,
// or hand-maintain this array until the portal's `events` table exists.
const EVENTS = [
  {
    date: 'SEP 12',
    type: 'Cohort',
    title: 'Fall 2026 DJ Cohort Begins',
    copy: '8 weeks, Saturdays 11AM–1PM, Charlotte. Applications open now — 15 spots.',
    poshUrl: '/cohort',
    internal: true,
  },
  {
    date: 'ONGOING',
    type: 'Workshop',
    title: 'Intro to DJ Workshop',
    copy: 'Beginner-friendly, hands-on sessions built for curiosity, creativity, and connection. No experience or gear required.',
    poshUrl: 'https://posh.vip/series/intro-to-dj-workshop',
  },
  {
    date: 'UPCOMING',
    type: 'Dance Night',
    title: 'Prism Social — Global Dance',
    copy: 'A night of sets from GlobalLYNK DJs. Open to everyone, no experience needed to attend.',
    poshUrl: 'https://posh.vip/e/prism-social-global-dance-',
  },
];

export default function Events() {
  return (
    <div>
      <section style={{ padding: `${space.xxl} 0 ${space.lg}` }}>
        <div style={container}>
          <div style={eyebrow}><span>Events</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '760px' }}>
            Workshops, dance nights, and everything else we've got going on.
          </h1>
        </div>
      </section>

      <div style={container}><Waveform seed={13} /></div>

      <section style={section}>
        <div style={container}>
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: space.lg,
                alignItems: 'center',
                padding: `${space.lg} 0`,
                borderBottom: `1px solid ${color.line}`,
              }}
              className="lynk-event-row"
            >
              <div style={{ fontFamily: font.mono, fontSize: '13px', color: color.cyanDim, letterSpacing: '0.06em' }}>
                {ev.date}
              </div>
              <div>
                <div style={{ fontFamily: font.mono, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: color.mutedDim, marginBottom: '6px' }}>
                  {ev.type}
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
          .lynk-event-row { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}
