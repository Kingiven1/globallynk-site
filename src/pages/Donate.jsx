import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, bodyLg, body, buttonPrimary, container, section, space, font, card } from '../styles/tokens';

const GIVEBUTTER_URL = 'https://givebutter.com/globallynk';

export default function Donate() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={51} size={420} style={{ position: 'absolute', top: '-120px', right: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Donate</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '700px' }}>
            Send the next winners to Mexico City.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            Our cultural exchange program is the nonprofit side of GlobalLYNK. Every
            donation goes directly toward flights, lodging, and experiences for the
            DJs who earn the trip through competition.
          </p>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div
            style={{
              ...card,
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