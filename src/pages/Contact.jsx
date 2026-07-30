import { Link } from 'react-router-dom';
import GradientOrb from '../components/GradientOrb';
import { color, eyebrow, h1, h2, bodyLg, body, buttonPrimary, container, section, space, font, card, radius } from '../styles/tokens';

const EMAIL = 'thegloballynk@gmail.com';

const REASONS = [
  { title: 'Partnerships & Sponsorships', copy: 'Brand partnerships, event sponsorships, or collaboration ideas.', href: `mailto:${EMAIL}?subject=Partnership%20Inquiry`, internal: false, cta: 'Email us →' },
  { title: 'Book a DJ', copy: "Looking to book one of our alumni DJs for an event.", href: '/book-dj', internal: true, cta: 'Fill out booking form →' },
  { title: 'Cohort & Workshop Questions', copy: 'Questions about applying, pricing, or what to expect.', href: `mailto:${EMAIL}?subject=Cohort%20%2F%20Workshop%20Question`, internal: false, cta: 'Email us →' },
  { title: 'Press & Media', copy: 'Press inquiries, interviews, or media requests.', href: `mailto:${EMAIL}?subject=Press%20%2F%20Media%20Inquiry`, internal: false, cta: 'Email us →' },
  { title: 'Donations & Cultural Exchange', copy: 'Questions about giving or our Mexico City exchange program.', href: `mailto:${EMAIL}?subject=Donation%20%2F%20Cultural%20Exchange%20Question`, internal: false, cta: 'Email us →' },
  { title: 'Everything Else', copy: "Not sure where it fits? Send it our way — we'll route it right.", href: `mailto:${EMAIL}?subject=General%20Inquiry`, internal: false, cta: 'Email us →' },
];

const cardStyle = { ...card, padding: space.lg, textDecoration: 'none', display: 'block', transition: 'transform 0.2s ease, box-shadow 0.2s ease' };

function ContactCard(props) {
  const r = props.reason;
  const inner = (
    <>
      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '19px', color: color.white, marginBottom: '8px' }}>{r.title}</h3>
      <p style={{ ...body, fontSize: '14px', marginBottom: space.sm }}>{r.copy}</p>
      <span style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan }}>{r.cta}</span>
    </>
  );

  if (r.internal) {
    return (
      <Link to={r.href} className="lynk-contact-card" style={cardStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={r.href} className="lynk-contact-card" style={cardStyle}>
      {inner}
    </a>
  );
}

export default function Contact() {
  return (
    <div>
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.lg}`, overflow: 'hidden' }}>
        <GradientOrb seed={41} size={420} style={{ position: 'absolute', top: '-120px', left: '-100px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1 }}>
          <div style={eyebrow}><span>Contact</span></div>
          <h1 style={{ ...h1, fontSize: 'clamp(36px, 6vw, 64px)', maxWidth: '700px' }}>
            Let's talk.
          </h1>
          <p style={{ ...bodyLg, maxWidth: '540px', marginTop: space.md }}>
            Partnerships, bookings, press, or just a question — pick what fits below.
          </p>
        </div>
      </section>

      <section style={section}>
        <div style={container}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: space.lg }}>
            <ContactCard reason={REASONS[0]} />
            <ContactCard reason={REASONS[1]} />
            <ContactCard reason={REASONS[2]} />
            <ContactCard reason={REASONS[3]} />
            <ContactCard reason={REASONS[4]} />
            <ContactCard reason={REASONS[5]} />
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
            <h2 style={{ ...h2, fontSize: '26px', marginBottom: '8px' }}>Prefer to just email directly?</h2>
            <p style={body}>{EMAIL}</p>
          </div>
          <a href={`mailto:${EMAIL}`} style={buttonPrimary}>Send an email →</a>
        </div>
      </section>

      <style>{`
        .lynk-contact-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}