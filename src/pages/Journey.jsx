import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, container, section, space, font, radius, card } from '../styles/tokens';
import competitionPhoto from '../assets/images/1-P1212434.jpg';
import mexicoDjsPhoto from '../assets/images/djcrew.jpg';
import winnersPhoto from '../assets/images/winners.jpg';

const STORY_PARTS = [
  {
    label: 'How they earned it',
    title: 'A three-round competition',
    copy: "Two DJs earned the trip by winning a competition built to test more than just mixing. Round one was a timed cable-and-setup race — figure out the wiring, get the gear running, fastest time wins. Round two tested music and DJ culture knowledge. Round three came down to one thing: who could actually rock the crowd. One winner, one man and one woman, walked away with an all-expenses-paid trip to Mexico City.",
    image: competitionPhoto,
  },
  {
    label: 'What they experienced',
    title: "A week that expanded what's possible",
    copy: "Once there, it wasn't just sightseeing. They gave back through community service at a local orphanage, and spent time with Mexico City's own high-level DJs — the kind who've built and curated their own events and communities instead of waiting to get booked by someone else. That's the model GlobalLYNK wants every DJ to see is possible: build the community, don't just work for hire. Between the culture, the food, and the city itself, the trip closed with our students performing a DJ set of their own at a party we curated for the occasion.",
    image: mexicoDjsPhoto,
  },
  {
    label: "What's next",
    title: 'This year\u2019s winners become next year\u2019s guides',
    copy: "As GlobalLYNK grows, so does this program. Next year, this year's winners return — not as chaperones, but as guides. They'll help organize the competition, help fundraise, and travel back to Mexico City alongside the next generation of winners to show them what's possible, the same way it was shown to them.",
    image: winnersPhoto,
  },
];

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
            GlobalLYNK is built around DJ culture — education, community,
            live programming, and cultural exchange, all pointed at the same thing:
            helping people build something with what they create.
          </p>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>Why we exist</span></div>
          <h2 style={{ ...h2, maxWidth: '720px', marginBottom: space.md }}>
            Everyone has a creative bone in their body.
          </h2>
          <p style={{ ...bodyLg, maxWidth: '700px', marginBottom: space.md }}>
            Growing up comes with responsibilities, and somewhere along the way,
            most people lose touch with whatever creative spark they had as a kid.
            GlobalLYNK exists to help people find that spark again — whether they're
            already working creatives or picking up a controller for the first time.
          </p>
          <p style={{ ...body, maxWidth: '700px' }}>
            Maybe it stays a hobby. Maybe it turns into a side gig. Maybe it becomes
            something real. Either way, there's a place for it here — and we're
            starting with DJing, but DJing is just the entry point. As GlobalLYNK
            grows, we're expanding into other creative mediums too, because this
            was never meant to be about one skill.
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
            Mexico City exchange photo coming soon
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: space.xl, marginBottom: space.xl }} className="lynk-journey-grid">
            <div style={eyebrow}><span>2026 — Mexico City</span></div>
            <div>
              <h2 style={{ ...h2, marginBottom: space.md }}>
                Our first cultural exchange
              </h2>
              <p style={{ ...bodyLg, marginBottom: space.md }}>
                We believe travel expands how creatives think. Seeing another scene,
                another culture, another way of building a career changes what feels
                possible — that's been true throughout our founder's own path, and
                it's why cultural exchange is core to GlobalLYNK's mission: making
                sure the creatives in our community get that same chance to grow
                beyond what's in front of them.
              </p>
              <p style={body}>
                This is what "creative community" means at GlobalLYNK — it's not
                just a classroom. It's travel, exchange, and putting the skill to work
                somewhere it matters.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: space.lg }}>
            {STORY_PARTS.map((part) => (
              <div key={part.title} style={{ ...card, padding: space.lg, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.lg, alignItems: 'start' }} className="lynk-story-card">
                <div>
                  <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: space.sm }}>
                    {part.label}
                  </div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px', color: color.white, marginBottom: '10px' }}>
                    {part.title}
                  </h3>
                  <p style={{ ...body, maxWidth: '760px' }}>{part.copy}</p>
                </div>
                <img
                  src={part.image}
                  alt={part.title}
                  style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    objectFit: 'cover',
                    borderRadius: radius.md,
                  }}
                />
              </div>
            ))}
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
              Help send the next winners to Mexico City.
            </h2>
            <p style={body}>Donations go directly toward flights, lodging, and experiences for our cultural exchange program.</p>
          </div>
          <Link to="/donate" style={buttonPrimary}>Donate →</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 780px) {
          .lynk-journey-grid { grid-template-columns: 1fr !important; }
          .lynk-story-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}