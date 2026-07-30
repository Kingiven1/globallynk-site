import { Link } from 'react-router-dom';
import { color, font, container, space } from '../styles/tokens';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${color.line}`,
        padding: `${space.xl} 0 ${space.lg}`,
      }}
    >
      <div
        style={{
          ...container,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: space.lg,
        }}
      >
        <div style={{ maxWidth: '340px' }}>
          <div
            style={{
              fontFamily: font.display,
              fontWeight: 700,
              fontSize: '18px',
              color: color.white,
              marginBottom: '12px',
            }}
          >
            GLOBAL<span style={{ color: color.cyan }}>LYNK</span>
          </div>
          <p style={{ fontFamily: font.body, fontSize: '14px', color: color.muted, lineHeight: 1.6 }}>
            Creativity is the highest form of wealth.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: 'Instagram', href: 'https://www.instagram.com/globallynk' },
              { label: 'TikTok', href: 'https://www.tiktok.com/@globallynk' },
              { label: 'Threads', href: 'https://www.threads.com/@globallynk' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: font.mono,
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  color: color.cyan,
                  textDecoration: 'none',
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: space.xl, flexWrap: 'wrap' }}>
          <div>
            <div style={{ ...footerLabel }}>Community</div>
            <FooterLink to="/events">Events</FooterLink>
            <FooterLink to="/cohort">Cohort</FooterLink>
            <FooterLink to="/alumni">DJs</FooterLink>
          </div>
          <div>
            <div style={{ ...footerLabel }}>About</div>
            <FooterLink to="/journey">Our Journey</FooterLink>
            <FooterLink to="/donate">Donate</FooterLink>
          </div>
          <div>
            <div style={{ ...footerLabel }}>Contact</div>
            <a
              href="mailto:connect@indabooth.com"
              style={{
                display: 'block',
                fontFamily: font.body,
                fontSize: '14px',
                color: color.muted,
                textDecoration: 'none',
                marginBottom: '10px',
              }}
            >
              connect@indabooth.com
            </a>
            <a
              href="mailto:connect@indabooth.com?subject=Partner%20Inquiry"
              style={{
                display: 'block',
                fontFamily: font.body,
                fontSize: '14px',
                color: color.muted,
                textDecoration: 'none',
              }}
            >
              Partner / Inquire
            </a>
          </div>
        </div>
      </div>

      <div
        style={{
          ...container,
          marginTop: space.lg,
          paddingTop: space.md,
          borderTop: `1px solid ${color.line}`,
          fontFamily: font.mono,
          fontSize: '11px',
          letterSpacing: '0.04em',
          color: color.mutedDim,
        }}
      >
        © 2026 GlobalLYNK × AmpSpot · All Rights Reserved
      </div>
    </footer>
  );
}

const footerLabel = {
  fontFamily: font.mono,
  fontSize: '11px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: color.mutedDim,
  marginBottom: '14px',
};

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        display: 'block',
        fontFamily: font.body,
        fontSize: '14px',
        color: color.muted,
        textDecoration: 'none',
        marginBottom: '10px',
      }}
    >
      {children}
    </Link>
  );
}
