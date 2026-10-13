import { useRef } from 'react';
import GradientOrb from '../components/GradientOrb';
import MixLabInterestForm from '../components/MixLabInterestForm';
import MixLabLogo from '../components/MixLabLogo';
import {
  color, font, eyebrow, h1, h2, h3, body, bodyLg, card,
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

const WHATS_PLANNED = [
  { title: 'Intro to DJ workshops', copy: 'Hands-on, beginner-friendly sessions for anyone curious about DJing.' },
  { title: 'Fireside chats & panels', copy: 'Conversations for all creatives on building a life and a career in culture.' },
  { title: 'A mental health conversation', copy: 'An honest talk about the pressure of creative work, and how to keep going.' },
  { title: 'DJ performances', copy: 'Sets from DJs across the community, celebrating the craft.' },
  { title: 'Social hour', copy: 'Time to meet, connect and build with the people in the room.' },
];

export default function MixLab() {
  const signupRef = useRef(null);
  const partnerRef = useRef(null);

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const partnerMailto = `mailto:${CONFIG.contactEmail}?subject=${encodeURIComponent('The Mix Lab — partnership inquiry')}`;

  return (
    <div>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section style={{ position: 'relative', padding: `${space.xxl} 0 ${space.xl}`, overflow: 'hidden' }}>
        <GradientOrb seed={11} size={520} style={{ position: 'absolute', top: '-140px', right: '-120px', zIndex: 0 }} />
        <div style={{ ...container, position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '820px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: space.lg }}>
            <MixLabLogo height={180} />
          </div>

          <div style={{ ...eyebrow, justifyContent: 'center' }}>
            <span>Art Basel · Miami · December 2026</span>
          </div>
          <h1 style={{ ...h1, fontSize: 'clamp(34px, 5.5vw, 64px)', marginTop: space.sm }}>
            Art Basel activation <span style={{ color: color.cyan }}>coming soon.</span>
          </h1>
          <p style={{ ...bodyLg, marginTop: space.md }}>
            A day to celebrate DJs and DJ culture. Presented by {CONFIG.presentedBy}.
          </p>

          <div style={{ display: 'flex', gap: space.sm, marginTop: space.lg, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => scrollTo(signupRef)} style={buttonPrimary}>
              Get the details first →
            </button>
            <button onClick={() => scrollTo(partnerRef)} style={buttonGhost}>
              Sponsors &amp; partners
            </button>
          </div>
        </div>
      </section>

      {/* ───────────────────────── WHAT IT IS ───────────────────────── */}
      <section style={section}>
        <div style={{ ...container, maxWidth: '760px' }}>
          <div style={eyebrow}><span>What is The Mix Lab?</span></div>
          <h2 style={{ ...h2, marginBottom: space.md }}>Where creators build culture.</h2>
          <p style={{ ...bodyLg, marginBottom: space.sm }}>
            The Mix Lab is an activation built for DJs and the creative community around them. It&apos;s a
            day to learn, connect and celebrate DJ culture in Miami during Art Basel week.
          </p>
          <p style={body}>
            Whether you&apos;ve never touched a controller or you&apos;ve been playing rooms for years, this is
            designed to be a place where you belong.
          </p>
        </div>
      </section>

      {/* ───────────────────────── WHAT'S PLANNED ───────────────────────── */}
      <section style={section}>
        <div style={container}>
          <div style={eyebrow}><span>What we&apos;re building</span></div>
          <h2 style={{ ...h2, marginBottom: space.lg, maxWidth: '640px' }}>What to expect.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: space.lg }}>
            {WHATS_PLANNED.map((item, i) => (
              <div key={item.title} style={{ ...card, padding: space.lg }}>
                <div style={{ fontFamily: font.mono, fontSize: '11px', letterSpacing: '0.05em', color: color.cyanDim, marginBottom: '8px' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ ...h3, fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ ...body, fontSize: '14px', margin: 0 }}>{item.copy}</p>
              </div>
            ))}
          </div>

          <p style={{ ...body, fontSize: '13px', marginTop: space.md }}>
            Program, lineup and location are still being finalized. Official details will go to the list first.
          </p>
        </div>
      </section>

      {/* ───────────────────────── EMAIL SIGNUP ───────────────────────── */}
      <section ref={signupRef} style={{ ...section, background: color.bgRaised }}>
        <div style={{ ...container, maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ ...eyebrow, justifyContent: 'center' }}><span>Stay in the loop</span></div>
          <h2 style={{ ...h2, marginBottom: space.sm }}>Be first to know when details drop.</h2>
          <p style={{ ...bodyLg, marginBottom: space.lg }}>
            Join the list and we&apos;ll send the official Mix Lab details as soon as they&apos;re ready,
            including how DJs and creatives can get involved.
          </p>
          <div style={{ ...card, padding: space.lg, textAlign: 'left' }}>
            <MixLabInterestForm />
          </div>
        </div>
      </section>

      {/* ───────────────────────── SPONSORS & PARTNERS ───────────────────────── */}
      <section ref={partnerRef} style={{ ...section, paddingBottom: space.xxl }}>
        <div style={{ ...container, ...card, padding: space.xl, textAlign: 'center', maxWidth: '760px' }}>
          <div style={{ ...eyebrow, justifyContent: 'center' }}><span>Sponsors &amp; partners</span></div>
          <h2 style={{ ...h2, fontSize: 'clamp(24px, 3.2vw, 34px)', marginBottom: space.sm }}>
            Want to build this with us?
          </h2>
          <p style={{ ...bodyLg, maxWidth: '560px', margin: `0 auto ${space.lg}` }}>
            We&apos;re building The Mix Lab with brands, venues and community partners who care about DJ
            culture and the creators behind it. If that&apos;s you, reach out directly.
          </p>
          <div style={{ display: 'flex', gap: space.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={partnerMailto} style={{ ...buttonPrimary, textDecoration: 'none' }}>
              Email us →
            </a>
            {CONFIG.onePagerUrl && (
              <a href={CONFIG.onePagerUrl} download style={{ ...buttonGhost, textDecoration: 'none' }}>
                Download the one-sheet
              </a>
            )}
          </div>
          <p style={{ ...body, fontSize: '13px', marginTop: space.sm }}>
            <a href={partnerMailto} style={{ color: color.cyan, textDecoration: 'none' }}>
              {CONFIG.contactEmail}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}