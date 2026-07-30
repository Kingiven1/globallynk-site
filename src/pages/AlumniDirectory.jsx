import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, buttonGhost, container, section, space, font, radius, card } from '../styles/tokens';

const BOOKING_CONTACT = 'mailto:connect@indabooth.com?subject=DJ%20Booking%20Inquiry';

const ALUMNI = [
  // { name: 'DJ Example', genres: ['Afrobeats', 'Amapiano'], mixUrl: '#', instagram: '@example', photo: null },
];

export default function AlumniDirectory() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={62} size={420} style={{ position: 'absolute', top: '-120px', right: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Discover DJs</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '700px' }}>
            Meet GlobalLYNK DJs.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            Every DJ here is a GlobalLYNK alumni, building their own profile — mixes,
            genres, and how to reach them — as they join the community.
          </p>
        </div>
      </section>

      <section style={{ padding: `0 0 ${space.lg}` }}>
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
              <h2 style={{ ...h2, fontSize: '26px', marginBottom: '8px' }}>Want to book a GlobalLYNK DJ?</h2>
              <p style={body}>Send us the details — date, budget, and vibe — and we'll connect you with the right DJ.</p>
            </div>
            <a href={BOOKING_CONTACT} style={buttonPrimary}>Book a DJ →</a>
          </div>
        </div>
      </section>

      <section style={{ ...section, paddingTop: 0 }}>
        <div style={container}>
          {ALUMNI.length === 0 ? (
            <div
              style={{
                border: `1px dashed ${color.line}`,
                borderRadius: radius.lg,
                padding: space.xxl,
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: '13px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: space.sm }}>
                Profiles coming soon
              </div>
              <p style={{ ...body, maxWidth: '440px', margin: '0 auto' }}>
                As DJs graduate and join, they'll build their own profile right here —
                check back soon, or follow{' '}
                <a href="https://instagram.com/globallynk" target="_blank" rel="noreferrer" style={{ color: color.cyan, textDecoration: 'none' }}>
                  @globallynk
                </a>{' '}
                for updates.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: space.lg }}>
              {ALUMNI.map((dj) => (
                <div key={dj.name} style={{ border: `1px solid ${color.line}`, borderRadius: radius.lg, overflow: 'hidden' }}>
                  <div
                    style={{
                      aspectRatio: '1/1',
                      background: color.bgRaised,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: font.mono,
                      fontSize: '11px',
                      color: color.mutedDim,
                    }}
                  >
                    {dj.photo ? (
                      <img src={dj.photo} alt={dj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      'Photo coming soon'
                    )}
                  </div>
                  <div style={{ padding: space.md }}>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '6px' }}>
                      {dj.name}
                    </h3>
                    <p style={{ ...body, fontSize: '13px', marginBottom: space.sm }}>
                      {dj.genres?.join(' · ')}
                    </p>
                    <a href={`/dj/${dj.name.toLowerCase().replace(/\s+/g, '-')}`} style={buttonGhost}>
                      View profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}