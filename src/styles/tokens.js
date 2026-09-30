export const color = {
  bg: '#F2ECD9',        // was near-black; now warm cream (BLACKWEEK-style background)
  bgRaised: '#FFFFFF',  // card/panel background — white against the cream page bg
  bgRaised2: '#F7F1E0', // slightly deeper cream, for a second raised layer
  line: '#E1D9C2',      // soft warm border color instead of dark gray
  white: '#17170F',     // NOTE: still named "white" (used everywhere as main text color) but now near-black for readability on the light bg — do not rename without also updating every page that imports it
  muted: '#5F5A4C',     // secondary/body text — warm gray instead of light gray
  mutedDim: '#8C8672',  // dimmer secondary text
  cyan: '#2E4BE0',      // NOTE: still named "cyan" (used everywhere as the primary accent) but now BLACKWEEK's royal blue
  cyanDim: '#1E37B0',   // darker blue, for dim/secondary accent uses
  cyanFaint: 'rgba(46,75,224,0.08)',
  purple: '#9D5CFF',
  pink: '#FF5CA8',
};

export const font = {
  display: "'Space Grotesk', -apple-system, sans-serif",
  body: "'Inter', -apple-system, sans-serif",
  mono: "'Space Grotesk', -apple-system, sans-serif",
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
  sm: '10px',
  md: '16px',
  lg: '24px',
  pill: '999px',
};

export const eyebrow = {
  fontFamily: font.mono,
  fontSize: '13px',
  letterSpacing: '0.02em',
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
  letterSpacing: '0.01em',
  color: '#FFFFFF',
  background: color.cyan,
  border: 'none',
  padding: '16px 28px',
  borderRadius: radius.pill,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
};

export const buttonGhost = {
  fontFamily: font.mono,
  fontSize: '13px',
  letterSpacing: '0.01em',
  color: color.white,
  background: 'transparent',
  border: `1px solid ${color.line}`,
  padding: '16px 28px',
  borderRadius: radius.pill,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'border-color 0.15s ease',
};

export const card = {
  background: color.bgRaised,
  border: `1px solid ${color.line}`,
  borderRadius: radius.lg,
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