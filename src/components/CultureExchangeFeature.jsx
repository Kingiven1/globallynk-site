import { Link } from 'react-router-dom';
import flyer from '../assets/images/tables-turned-flyer.jpg';
import {
  color, font, eyebrow, h2, bodyLg, body, card, radius,
  buttonPrimary, buttonGhost, container, section, space,
} from '../styles/tokens';

// Homepage feature block for the Culture Exchange competition (Round 2: public voting).
// To retire it after voting closes, just remove <CultureExchangeFeature /> from Home.jsx.

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
        <Link to="/culture-exchange/vote" style={{ display: 'block' }}>
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
          <div style={eyebrow}><span>Voting opens Tuesday, Nov 3 · Closes Nov 12</span></div>
          <h2 style={{ ...h2, marginBottom: space.sm }}>Tables Turned. Your vote decides.</h2>
          <p style={{ ...bodyLg, marginBottom: space.sm }}>
            18 DJs. Five women and five men will advance to the live finals in Charlotte, and the
            winners head to the 2027 Culture Exchange in Mexico City. Watch the sets now, then vote for
            one woman and one man when polls open Tuesday, Nov 3.
          </p>
          <p style={{ ...body, fontFamily: font.mono, fontSize: '13px', color: color.cyanDim, marginBottom: space.md }}>
            18 DJS &nbsp;|&nbsp; OPENS NOV 3 &nbsp;|&nbsp; CLOSES NOV 12
          </p>
          <div style={{ display: 'flex', gap: space.sm, flexWrap: 'wrap' }}>
            <Link to="/culture-exchange/vote" style={{ ...buttonPrimary, textDecoration: 'none' }}>
              WATCH THE SETS →
            </Link>
            <Link to="/culture-exchange" style={{ ...buttonGhost, textDecoration: 'none' }}>
              HOW IT WORKS
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
