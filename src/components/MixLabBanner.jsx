import { Link } from 'react-router-dom';
import MixLabLogo from './MixLabLogo';
import {
  color, font, card, buttonPrimary, container, space,
} from '../styles/tokens';

// Homepage announcement strip for The Mix Lab (Art Basel Miami).
// To retire it later, remove <MixLabBanner /> from Home.jsx.

export default function MixLabBanner() {
  return (
    <div style={{ padding: `${space.md} 0 0` }}>
      <div
        style={{
          ...container,
          ...card,
          padding: `${space.md} ${space.lg}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: space.md,
          flexWrap: 'wrap',
          border: `1px solid ${color.cyanDim}`,
          boxShadow: `0 0 0 1px ${color.cyanFaint}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: space.md, flexWrap: 'wrap' }}>
          <MixLabLogo height={44} />
          <div>
            <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: '4px' }}>
              ART BASEL · DECEMBER 2026
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '18px', color: color.white }}>
              We&apos;re coming to Miami.
            </div>
          </div>
        </div>

        <Link to="/mix-lab" style={{ ...buttonPrimary, textDecoration: 'none' }}>
          Click here for more info →
        </Link>
      </div>
    </div>
  );
}