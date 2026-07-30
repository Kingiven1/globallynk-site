// GlobalLYNK design tokens
// Palette, type, and spacing derived from the brand's editorial/minimalist identity.

export const color = {
  bg: '#0D0D0D',        // primary background
  bgRaised: '#161616',  // card / raised surface
  bgRaised2: '#1D1D1D', // hover / deeper raised surface
  line: '#2A2A2A',      // hairline dividers
  white: '#F5F5F3',     // primary text (soft white, not pure white)
  muted: '#8C8C88',     // secondary text
  mutedDim: '#5C5C58',  // tertiary / disabled text
  cyan: '#00C2D4',      // primary accent
  cyanDim: '#0A8A96',   // accent hover / secondary accent
  cyanFaint: 'rgba(0,194,212,0.08)', // accent wash for backgrounds
};

export const font = {
  display: "'Space Grotesk', -apple-system, sans-serif",
  body: "'Inter', -apple-system, sans-serif",
  mono: "'Space Mono', 'IBM Plex Mono', monospace",
};

export const space = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '40px',
  xl: '64px',
  xxl: '96px',
  xxxl: '144px',
};

export const radius = {
  sm: '2px',
  md: '4px',
};

// Shared style fragments reused across pages
export const eyebrow = {
  fontFamily: font.mono,
  fontSize: '12px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: color.cyan,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: space.sm,
};

export const h1 = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 'clamp(40px, 7vw, 84px)',
  lineHeight: 1.02,
  letterSpacing: '-0.02em',
  color: color.white,
  margin: 0,
};

export const h2 = {
  fontFamily: font.display,
  fontWeight: 700,
  fontSize: 'clamp(28px, 4vw, 44px)',
  lineHeight: 1.08,
  letterSpacing: '-0.01em',
  color: color.white,
  margin: 0,
};

export const h3 = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: '22px',
  lineHeight: 1.2,
  color: color.white,
  margin: 0,
};

export const body = {
  fontFamily: font.body,
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: 1.6,
  color: color.muted,
};

export const bodyLg = {
  fontFamily: font.body,
  fontWeight: 400,
  fontSize: '19px',
  lineHeight: 1.55,
  color: color.muted,
};

export const buttonPrimary = {
  fontFamily: font.mono,
  fontSize: '13px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: color.bg,
  background: color.cyan,
  border: 'none',
  padding: '16px 28px',
  borderRadius: radius.sm,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'background 0.15s ease, transform 0.15s ease',
};

export const buttonGhost = {
  fontFamily: font.mono,
  fontSize: '13px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: color.white,
  background: 'transparent',
  border: `1px solid ${color.line}`,
  padding: '16px 28px',
  borderRadius: radius.sm,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
};

export const page = {
  background: color.bg,
  minHeight: '100vh',
  fontFamily: font.body,
};

export const container = {
  maxWidth: '1180px',
  margin: '0 auto',
  padding: '0 32px',
};

export const section = {
  padding: `${space.xxl} 0`,
};
