import { Link } from 'react-router-dom';
import flyer from '../assets/images/tables-turned-flyer.jpg';
import {
  color, font, eyebrow, h2, bodyLg, body, card, radius,
  buttonPrimary, buttonGhost, container, section, space,
} from '../styles/tokens';

// Homepage feature block for the Culture Exchange competition.
// To retire it after Round 1, just remove <CultureExchangeFeature /> from Home.jsx.

export default function CultureExchangeFeature() {
  return (
    <section style={section}>
      <div
        style={{
          ...container,
          ...card,
          padding: space.xl,
          display: 'grid',
          gridTemplateColumns: '0.8fr 1.2fr',
          gap: space.xl,
          alignItems: 'center',
        }}
        className="ce-feature-grid"
      >
        <Link to="/culture-exchange" style={{ display: 'block' }}>
          <img
            src={flyer}
            alt="Tables Turned DJ Competition — Global Lynk Culture Exchange 2027"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: radius.lg,
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
            }}
          />
        </Link>

        <div>
          <div style={eyebrow}><span>Applications open · Oct 5 – Oct 19</span></div>
          <h2 style={{ ...h2, marginBottom: space.sm }}>Tables Turned. DJs, your turn.</h2>
          <p style={{ ...bodyLg, marginBottom: space.sm }}>
            Global Lynk is searching for two DJs, one woman and one man, to represent our community
            at the 2027 Culture Exchange in Mexico City. It starts with a one-minute performance video.
          </p>
          <p style={{ ...body, fontFamily: font.mono, fontSize: '13px', color: color.cyanDim, marginBottom: space.md }}>
            4 SONGS &nbsp;|&nbsp; 2 GENRES &nbsp;|&nbsp; 1 LIVE MASHUP
          </p>
          <div style={{ display: 'flex', gap: space.sm, flexWrap: 'wrap' }}>
            <Link to="/culture-exchange" style={{ ...buttonPrimary, textDecoration: 'none' }}>
              APPLY NOW →
            </Link>
            <Link to="/culture-exchange" style={{ ...buttonGhost, textDecoration: 'none' }}>
              SEE THE RULES
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ce-feature-grid { grid-template-columns: 1fr !important; padding: 24px !important; }
        }
      `}</style>
    </section>
  );
}