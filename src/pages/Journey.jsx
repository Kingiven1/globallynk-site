import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, container, section, space, font, radius, card } from '../styles/tokens';

export default function Journey() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={31} size={480} style={{ position: 'absolute', top: '-140px', left: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Our Journey</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 68px)', maxWidth: '780px' }}>
            Creativity is the highest form of wealth.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '560px', marginTop: space.md }}>
            GlobalLYNK is a nonprofit built around DJ culture — education, community,
            live programming, and cultural exchange, all pointed at the same thing:
            helping people build something with what they create.
          </p>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div
            style={{
              aspectRatio: '21/9',
              background: color.bgRaised,
              border: `1px solid ${color.line}`,
              borderRadius: radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: font.mono,
              fontSize: '12px',
              color: color.mutedDim,
              marginBottom: space.xl,
            }}
          >
            [ Mexico City cultural exchange — photo ]
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: space.xl }} className="lynk-journey-grid">
            <div style={eyebrow}><span>2026 — Mexico City</span></div>
            <div>
              <h2 style={{ ...h2, marginBottom: space.md }}>
                Our first cultural exchange
              </h2>
              <p style={{ ...bodyLg, marginBottom: space.md }}>
                We took a group of students to Mexico City for a week — learning the
                culture, eating the food, and living the experience firsthand.
                The trip closed with our students playing a DJ set of their own,
                built from what they'd learned in the cohort back home.
              </p>
              <p style={body}>
                This is what "creative community" means at GlobalLYNK — it's not
                just a classroom. It's travel, exchange, and putting the skill to work
                somewhere it matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>What we've built</span></div>
          <h2 style={{ ...h2, maxWidth: '640px', marginBottom: space.xl }}>
            Charlotte-based, growing city by city.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: space.lg }}>
            {[
              { title: 'Workshops', copy: 'Monthly intro sessions for beginners and bedroom DJs, no experience required.' },
              { title: 'Cohorts', copy: 'An 8-week program running one to two times a year, capped at 15 students per class.' },
              { title: 'Live events', copy: 'Dance nights and showcases featuring GlobalLYNK DJs and alumni.' },
              { title: 'Cultural exchange', copy: 'Travel programming that connects creative skill to culture and place.' },
            ].map((s) => (
              <div key={s.title} style={{ borderTop: `1px solid ${color.line}`, paddingTop: space.sm }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white, marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ ...body, fontSize: '14px' }}>{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...section, paddingBottom: space.xxxl }}>
        <div
          style={{
            ...container,
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
            <h2 style={{ ...h2, fontSize: '30px', marginBottom: '8px' }}>
              Help us take more students further.
            </h2>
            <p style={body}>Donations go directly toward workshops, cohort scholarships, and exchange trips.</p>
          </div>
          <Link to="/donate" style={buttonPrimary}>Donate →</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 780px) {
          .lynk-journey-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}