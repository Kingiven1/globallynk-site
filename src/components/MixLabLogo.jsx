import { color } from '../styles/tokens';

// ──────────────────────────────────────────────────────────────────────────
// The Mix Lab logo — ONE place to update.
// Until the real logo is ready, this shows a text wordmark so nothing breaks.
//
// When you get the logo file:
//   1. Save it in src/assets/images/ as  mix-lab-logo.png  (transparent background)
//   2. Uncomment the import line below
//   3. Delete the line:  const logo = null;
// The homepage banner and the /mix-lab page both pick it up automatically.
// ──────────────────────────────────────────────────────────────────────────

// import logo from '../assets/images/mix-lab-logo.png';
const logo = null;

export default function MixLabLogo({ height = 56 }) {
  if (logo) {
    return <img src={logo} alt="The Mix Lab" style={{ height: `${height}px`, width: 'auto', display: 'block' }} />;
  }

  return (
    <div
      style={{
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 700,
        fontSize: `${Math.round(height * 0.55)}px`,
        letterSpacing: '0.12em',
        lineHeight: 1,
        color: color.white,
        whiteSpace: 'nowrap',
      }}
    >
      THE MIX LAB
    </div>
  );
}