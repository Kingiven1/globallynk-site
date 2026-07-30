import Waveform from '../components/Waveform';
import { color, eyebrow, h1, bodyLg, body, buttonPrimary, container, section, space, font } from '../styles/tokens';

// Swap GIVEBUTTER_URL for the real campaign link once it's set up.
// Givebutter also supports an embeddable widget (<script> snippet from
// their dashboard) — drop it into the box below in place of the button
// if you'd rather donors give without leaving the site.
const GIVEBUTTER_URL = 'https://givebutter.com/globallynk';

export default function Donate() {
  return (
    <div>
      <section style={{ padding: `${space.xxl} 0 ${space.lg}` }}>
        <div style={container}>
          <div style={eyebrow}><span>Donate</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '700px' }}>
            Fund the next workshop, cohort, or cultural exchange.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            GlobalLYNK is a nonprofit. Every donation goes toward keeping workshops
            accessible, funding cohort scholarships, and running programs like our
            Mexico City cultural exchange.
          </p>
        </div>
      </section>

      <div style={container}><Waveform seed={51} /></div>

      <section style={section}>
        <div style={container}>
          <div
            style={{
              border: `1px solid ${color.line}`,
              padding: space.xl,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: space.md,
            }}
          >
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', color: color.white, marginBottom: '8px' }}>
                Give through Givebutter
              </h2>
              <p style={body}>Secure, third-party donation processing — one-time or recurring.</p>
            </div>
            <a href={GIVEBUTTER_URL} target="_blank" rel="noreferrer" style={buttonPrimary}>
              Donate on Givebutter →
            </a>
          </div>

          <p style={{ fontFamily: font.mono, fontSize: '12px', color: color.mutedDim, marginTop: space.sm }}>
            You'll leave globallynk.club to complete your donation securely on Givebutter.
          </p>
        </div>
      </section>
    </div>
  );
}
