// GlobalLYNK design tokens — Apple-style: system font, light grey page, white cards,
// big calm headlines. Accent colors come from the Intro to DJ Workshop flyer.
//
// NOTE: names are historical. `white` is the MAIN TEXT color (near-black) and `cyan` is the
// PRIMARY ACCENT (now flyer teal). Do not rename without updating every page that imports them.

export const color = {
  bg: '#F5F5F7',        // Apple-style light grey page
  bgRaised: '#FFFFFF',  // cards / panels
  bgRaised2: '#FBFBFD', // a second, lighter layer
  line: '#D2D2D7',      // thin grey borders
  white: '#1D1D1F',     // main text (near-black)
  muted: '#6E6E73',     // secondary text
  mutedDim: '#86868B',  // dimmer secondary text
  cyan: '#087C91',      // primary accent: flyer teal, deep enough to read on light grey
  cyanDim: '#066376',   // darker teal for small text
  cyanFaint: 'rgba(8,124,145,0.08)',
  purple: '#7B3FE4',    // flyer purple
  pink: '#D6338A',      // flyer magenta
  orange: '#F26B1D',    // flyer orange
  // For use on dark sections (hero, feature bands)
  ink: '#000000',
  inkText: '#F5F5F7',
  inkMuted: '#A1A1A6',
  tealBright: '#2ED3E6',
};

// One system font stack, like apple.com: SF Pro on Mac/iPhone, Inter everywhere else.
const SYSTEM = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Helvetica Neue', Arial, sans-serif";
export const font = {
  display: SYSTEM,
  body: SYSTEM,
  mono: SYSTEM,
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
  sm: '12px',
  md: '18px',
  lg: '28px',
  pill: '980px',
};

export const eyebrow = {
  fontFamily: font.body,
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0',
  color: color.cyan,
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: space.sm,
};

export const h1 = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 'clamp(40px, 7vw, 80px)',
  lineHeight: 1.05,
  letterSpacing: '-0.035em',
  color: color.white,
  margin: 0,
};

export const h2 = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: 'clamp(28px, 4vw, 48px)',
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  color: color.white,
  margin: 0,
};

export const h3 = {
  fontFamily: font.display,
  fontWeight: 600,
  fontSize: '22px',
  lineHeight: 1.2,
  letterSpacing: '-0.015em',
  color: color.white,
  margin: 0,
};

export const body = {
  fontFamily: font.body,
  fontWeight: 400,
  fontSize: '17px',
  lineHeight: 1.5,
  letterSpacing: '-0.01em',
  color: color.muted,
};

export const bodyLg = {
  fontFamily: font.body,
  fontWeight: 400,
  fontSize: '21px',
  lineHeight: 1.4,
  letterSpacing: '-0.015em',
  color: color.muted,
};

export const buttonPrimary = {
  fontFamily: font.body,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: '#FFFFFF',
  background: color.cyan,
  border: 'none',
  padding: '13px 24px',
  borderRadius: radius.pill,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'transform 0.15s ease, opacity 0.15s ease',
};

export const buttonGhost = {
  fontFamily: font.body,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: color.cyan,
  background: 'transparent',
  border: `1px solid ${color.cyan}`,
  padding: '12px 24px',
  borderRadius: radius.pill,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  transition: 'background 0.15s ease',
};

export const card = {
  background: color.bgRaised,
  border: '1px solid rgba(0,0,0,0.06)',
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