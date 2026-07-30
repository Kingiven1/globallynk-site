import Waveform from '../components/Waveform';
import { color, eyebrow, h1, bodyLg, body, buttonGhost, container, section, space, font } from '../styles/tokens';

// Placeholder shape for what a Supabase `dj_profiles` row will look like.
// Swap ALUMNI for a fetch from Supabase once the alumni role/table exists.
const ALUMNI = [
  // { name: 'DJ Example', genres: ['Afrobeats', 'Amapiano'], mixUrl: '#', instagram: '@example', photo: null },
];

export default function AlumniDirectory() {
  return (
    <div>
      <section style={{ padding: `${space.xxl} 0 ${space.lg}` }}>
        <div style={container}>
          <div style={eyebrow}><span>DJs</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '700px' }}>
            GlobalLYNK alumni, available to book.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            Every DJ here graduated from a GlobalLYNK cohort. Browse profiles, check
            genres and mixes, and reach out directly to book.
          </p>
        </div>
      </section>

      <div style={container}><Waveform seed={62} /></div>

      <section style={section}>
        <div style={container}>
          {ALUMNI.length === 0 ? (
            <div
              style={{
                border: `1px dashed ${color.line}`,
                padding: space.xxl,
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: font.mono, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.cyanDim, marginBottom: space.sm }}>
                First graduating class — November 2026
              </div>
              <p style={{ ...body, maxWidth: '440px', margin: '0 auto' }}>
                Our first cohort graduates in November. This page goes live with
                real profiles right after — check back then, or follow{' '}
                <a href="https://instagram.com/globallynk" target="_blank" rel="noreferrer" style={{ color: color.cyan, textDecoration: 'none' }}>
                  @globallynk
                </a>{' '}
                for updates.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: space.lg }}>
              {ALUMNI.map((dj) => (
                <div key={dj.name} style={{ border: `1px solid ${color.line}` }}>
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
                      '[ Photo ]'
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
