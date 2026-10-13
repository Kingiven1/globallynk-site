import { useRef } from 'react';
import MixLabInterestForm from '../components/MixLabInterestForm';
import MixLabLogo from '../components/MixLabLogo';
import {
  font, h1, h2, h3, body, bodyLg,
  buttonPrimary, buttonGhost, container, section, space,
} from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// EDITABLE CONFIGURATION
// ──────────────────────────────────────────────────────────────────────────

const CONFIG = {
  // Where sponsors / partners / collaborators reach you.
  contactEmail: 'connect@indabooth.com',

  // The downloadable one-sheet. Leave as null and the download button stays
  // hidden. When the PDF is ready, put it in the project's /public folder and
  // set this to its path, e.g. '/mix-lab-one-sheet.pdf'.
  onePagerUrl: null,

  // Who the page says is presenting. Shown in the hero as "Presented by ...".
  presentedBy: 'GlobalLYNK, AmpSpot & NFNTE Capital',
};

// ──────────────────────────────────────────────────────────────────────────
// ART BASEL 2026 PALETTE — this page only (the rest of the site is untouched).
// Bold cobalt blue + yellow, with pastel tones and hard-edged "poster" shadows.
// Change a color here and the whole page follows.
// ──────────────────────────────────────────────────────────────────────────

const P = {
  cobalt: '#2B3FD6',
  yellow: '#F9D000',
  ink: '#1B1B3A',
  inkSoft: '#3D3D5C',
  white: '#FFFFFF',
  pink: '#FFD3E6',
  peach: '#FFD9C7',
  butter: '#FFF1B8',
  mint: '#CDEFE0',
  lilac: '#E4D9FF',
  sky: '#D6E6FF',
};

// Fine grain + dot texture for the bold blue sections.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.12 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const texturedBlue = {
  backgroundColor: P.cobalt,
  backgroundImage: `radial-gradient(rgba(255,255,255,0.14) 1.6px, transparent 1.6px), ${GRAIN}`,
  backgroundSize: '24px 24px, 160px 160px',
};

const poster = {
  border: `2px solid ${P.ink}`,
  boxShadow: `5px 5px 0 ${P.ink}`,
};

const pill = {
  display: 'inline-block',
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.04em',
  color: P.ink,
  background: P.yellow,
  border: `2px solid ${P.ink}`,
  borderRadius: '999px',
  padding: '6px 14px',
};

const WHATS_PLANNED = [
  { title: 'Intro to DJ workshops', copy: 'Hands-on, beginner-friendly sessions for anyone curious about DJing.', bg: P.pink },
  { title: 'Fireside chats & panels', copy: 'Conversations for all creatives and entrepreneurs on building a life, a brand and a career in culture.', bg: P.butter },
  { title: 'A mental health conversation', copy: 'An honest talk about the pressure of creative and entrepreneurial work, and how to keep going.', bg: P.mint },
  { title: 'DJ performances', copy: 'Sets from DJs across the community, celebrating the craft.', bg: P.lilac },
  { title: 'Social hour', copy: 'Time to meet, connect and build with the DJs, creators and entrepreneurs in the room.', bg: P.peach },
];

export default function MixLab() {
  const signupRef = useRef(null);
  const partnerRef = useRef(null);

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const partnerMailto = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent('The Mix Lab — partnership inquiry')}`;

  const yellowButton = {
    ...buttonPrimary,
    background: P.yellow,
    color: P.ink,
    border: `2px solid ${P.ink}`,
    boxShadow: `4px 4px 0 ${P.ink}`,
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const outlineWhiteButton = {
    ...buttonGhost,
    background: 'transparent',
    color: P.white,
    border: `2px solid ${P.white}`,
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section
        style={{
          ...texturedBlue,
          position: 'relative',
          padding: `${space.xxl} 0 ${space.xxl}`,
          overflow: 'hidden',
          borderRadius: '0 0 48px 48px',
        }}
      >
        {/* playful pastel shapes */}
        <div style={{ position: 'absolute', top: '-90px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: P.pink, opacity: 0.9 }} />
        <div style={{ position: 'absolute', bottom: '-110px', right: '-70px', width: '320px', height: '320px', borderRadius: '50%', background: P.mint, opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: '22%', right: '8%', width: '90px', height: '90px', borderRadius: '50%', background: P.butter, opacity: 0.95 }} />
        <div style={{ position: 'absolute', bottom: '14%', left: '9%', width: '70px', height: '70px', borderRadius: '18px', background: P.lilac, transform: 'rotate(18deg)', opacity: 0.95 }} />

        <div style={{ ...container, position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '820px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: space.lg }}>
            <MixLabLogo height={180} />
          </div>

          <span style={pill}>ART BASEL · MIAMI · DECEMBER 2026</span>

          <h1 style={{ ...h1, color: P.white, fontSize: 'clamp(34px, 5.5vw, 64px)', marginTop: space.md }}>
            Art Basel activation <span style={{ color: P.yellow }}>coming soon.</span>
          </h1>
          <p style={{ ...bodyLg, color: P.lilac, marginTop: space.md }}>
            A day to celebrate DJs, Creators and those making moves in the business world.
          </p>
          <p style={{ ...body, color: P.white, marginTop: '4px' }}>
            Presented by {CONFIG.presentedBy}
          </p>

          <div style={{ display: 'flex', gap: space.sm, marginTop: space.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => scrollTo(signupRef)} style={yellowButton}>
              Get the details first →
            </button>
            <button onClick={() => scrollTo(partnerRef)} style={outlineWhiteButton}>
              Sponsors &amp; partners
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WHAT IT IS ───────────────────────── */}
      <section style={section}>
        <div style={{ ...container, maxWidth: '820px' }}>
          <div
            style={{
              ...poster,
              background: P.butter,
              borderRadius: '28px',
              padding: `${space.xl} ${space.xl}`,
            }}
          >
            <span style={{ ...pill, background: P.white }}>WHAT IS THE MIX LAB?</span>
            <h2 style={{ ...h2, color: P.ink, margin: `${space.md} 0 ${space.md}` }}>Where creators build culture.</h2>
            <p style={{ ...bodyLg, color: P.inkSoft, marginBottom: space.sm }}>
              The Mix Lab is an activation built for DJs, creators and entrepreneurs, and the community
              around them. It&apos;s a day to learn, connect and celebrate DJ culture and the business of
              creativity in Miami during Art Basel week.
            </p>
            <p style={{ ...body, color: P.inkSoft, margin: 0 }}>
              Whether you&apos;ve never touched a controller, you&apos;re building a brand, or you&apos;ve been
              playing rooms and running a business for years, this is designed to be a place where you
              belong.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WHAT'S PLANNED ───────────────────────── */}
      <section style={{ ...section, background: P.sky }}>
        <div style={container}>
          <span style={{ ...pill, background: P.white }}>WHAT WE&apos;RE BUILDING</span>
          <h2 style={{ ...h2, color: P.ink, margin: `${space.md} 0 ${space.lg}`, maxWidth: '640px' }}>What to expect.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: space.lg }}>
            {WHATS_PLANNED.map((item, i) => (
              <div
                key={item.title}
                style={{ ...poster, background: item.bg, borderRadius: '22px', padding: space.lg }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: P.white,
                    border: `2px solid ${P.ink}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: font.mono,
                    fontSize: '12px',
                    color: P.ink,
                    marginBottom: '12px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ ...h3, color: P.ink, fontSize: '19px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ ...body, color: P.inkSoft, fontSize: '14px', margin: 0 }}>{item.copy}</p>
              </div>
            ))}
          </div>

          <p style={{ ...body, color: P.inkSoft, fontSize: '13px', marginTop: space.md }}>
            Program, lineup and location are still being finalized. Official details will go to the list first.
          </p>
        </div>
      </section>

      {/* ───────────────────────── EMAIL SIGNUP ───────────────────────── */}
      <section ref={signupRef} style={{ ...section, background: P.pink }}>
        <div style={{ ...container, maxWidth: '640px', textAlign: 'center' }}>
          <span style={{ ...pill, background: P.white }}>STAY IN THE LOOP</span>
          <h2 style={{ ...h2, color: P.ink, margin: `${space.md} 0 ${space.sm}` }}>Be first to know when details drop.</h2>
          <p style={{ ...bodyLg, color: P.inkSoft, marginBottom: space.lg }}>
            Join the list and you&apos;ll get the official Mix Lab announcement the moment we drop the
            details.
          </p>
          <div style={{ ...poster, background: P.white, borderRadius: '24px', padding: space.lg, textAlign: 'left' }}>
            <MixLabInterestForm />
          </div>
        </div>
      </section>

      {/* ───────────────────────── SPONSORS & PARTNERS ───────────────────────── */}
      <section
        ref={partnerRef}
        style={{
          ...texturedBlue,
          padding: `${space.xxl} 0`,
          borderRadius: '48px 48px 0 0',
        }}
      >
        <div style={{ ...container, textAlign: 'center', maxWidth: '760px' }}>
          <span style={pill}>SPONSORS &amp; PARTNERS</span>
          <h2 style={{ ...h2, color: P.white, fontSize: 'clamp(24px, 3.2vw, 36px)', margin: `${space.md} 0 ${space.sm}` }}>
            Want to build this with us?
          </h2>
          <p style={{ ...bodyLg, color: P.lilac, maxWidth: '560px', margin: `0 auto ${space.lg}` }}>
            We&apos;re building The Mix Lab with brands, venues and community partners who care about DJ
            culture, creators and entrepreneurs. If that&apos;s you, reach out directly.
          </p>
          <div style={{ display: 'flex', gap: space.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={partnerMailto} style={yellowButton}>
              Email us →
            </a>
            {CONFIG.onePagerUrl && (
              <a href={CONFIG.onePagerUrl} download style={outlineWhiteButton}>
                Download the one-sheet
              </a>
            )}
          </div>
          <p style={{ ...body, fontSize: '14px', marginTop: space.sm }}>
            <a href={partnerMailto} style={{ color: P.yellow, textDecoration: 'none' }}>
              {CONFIG.contactEmail}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}