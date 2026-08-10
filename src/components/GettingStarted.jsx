import { useState } from 'react';
import { color, eyebrow, card, radius, body, space, font } from '../styles/tokens';

const GEAR = [
  {
    category: 'Controller',
    items: [
      {
        name: 'Pioneer DJ DDJ-FLX4',
        price: '~$329',
        note: 'The top pick for beginners. Two decks, works with rekordbox (free) and Serato, laid out like real club gear so what you learn transfers directly. Will not outgrow you as you improve.',
        url: 'https://www.zzounds.com/item--PIODDJFLX4',
      },
      {
        name: 'Numark Mixtrack Platinum FX',
        price: '~$279–299',
        note: '4-deck capability instead of 2, larger 6" jog wheels, dedicated effects paddles. Great alternative with more room to grow into.',
        url: 'https://www.zzounds.com/item--NUMMIXTRCKPLATFX',
      },
    ],
  },
  {
    category: 'Headphones',
    items: [
      {
        name: 'Pioneer DJ HDJ-CUE1',
        price: '~$50–80',
        note: 'Lightweight, closed-back, built specifically for DJ monitoring. The practical, reliable choice.',
        url: 'https://www.zzounds.com/item--PIOHDJCUE1',
      },
      {
        name: 'Audio-Technica ATH-M50x',
        price: '~$150–170',
        note: 'A step up in sound quality — works equally well for DJing and any future music production.',
        url: 'https://www.zzounds.com/item--AUTATHM50X',
      },
    ],
  },
];

const PORTAL_STEPS = [
  { title: 'Homework tab', copy: 'Shows what\u2019s due and when. Type your response and hit submit \u2014 you\u2019ll see a checkmark once it\u2019s in.' },
  { title: 'Class materials', copy: 'Recaps, notes, and files your instructor posts after each session.' },
  { title: 'Class Chat', copy: 'Message the whole cohort at once \u2014 good for questions everyone might have.' },
  { title: 'Direct Messages', copy: 'Pick a classmate or instructor from the dropdown for a private 1-on-1 conversation.' },
  { title: 'Files', copy: 'Any download shows a \u201cView file \u2192\u201d link right under the post.' },
];

export default function GettingStarted() {
  const [tab, setTab] = useState('gear');

  return (
    <div
      style={{
        ...card,
        padding: space.lg,
        marginBottom: space.xl,
        border: `1px solid ${color.cyanDim}`,
        boxShadow: `0 0 0 1px ${color.cyanFaint}`,
      }}
    >
      <div style={eyebrow}><span>Start here</span></div>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', color: color.white, marginBottom: space.md }}>
        Getting Started
      </h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: space.md }}>
        <button onClick={() => setTab('gear')} style={tab === 'gear' ? tabActive : tabInactive}>Gear Guide</button>
        <button onClick={() => setTab('portal')} style={tab === 'portal' ? tabActive : tabInactive}>Using the Portal</button>
      </div>

      {tab === 'gear' ? (
        <div>
          {GEAR.map((group) => (
            <div key={group.category} style={{ marginBottom: space.md }}>
              <div style={{ fontFamily: font.mono, fontSize: '12px', letterSpacing: '0.02em', color: color.cyanDim, marginBottom: space.sm }}>
                {group.category.toUpperCase()}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm }} className="lynk-gear-grid">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'block',
                      background: color.bgRaised2,
                      border: `1px solid ${color.line}`,
                      borderRadius: radius.md,
                      padding: space.sm,
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '2px' }}>
                      {item.name}
                    </div>
                    <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyan, marginBottom: '6px' }}>
                      {item.price}
                    </div>
                    <p style={{ ...body, fontSize: '13px' }}>{item.note}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: color.bgRaised2, border: `1px solid ${color.line}`, borderRadius: radius.md, padding: space.sm, marginTop: space.sm }}>
            <div style={{ fontFamily: font.mono, fontSize: '12px', color: color.cyanDim, marginBottom: '6px' }}>
              NO CREDIT NEEDED
            </div>
            <p style={{ ...body, fontSize: '13px', marginBottom: space.xs }}>
              Look for items marked "No Credit Check" on zZounds, add to cart, and select that payment plan at checkout. No SSN, no paperwork, no interest, no late fees.
            </p>
            <a href="https://www.zzounds.com/cat--Computer-DJ--4039" target="_blank" rel="noreferrer" style={{ color: color.cyan, fontFamily: font.mono, fontSize: '12px' }}>
              Browse zZounds DJ gear →
            </a>
          </div>
        </div>
      ) : (
        <div>
          {PORTAL_STEPS.map((step) => (
            <div key={step.title} style={{ borderBottom: `1px solid ${color.line}`, padding: `${space.sm} 0` }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '15px', color: color.white, marginBottom: '2px' }}>
                {step.title}
              </div>
              <p style={{ ...body, fontSize: '13px' }}>{step.copy}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .lynk-gear-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const tabActive = {
  fontFamily: font.body,
  fontWeight: 600,
  fontSize: '13px',
  color: color.bg,
  background: color.cyan,
  border: 'none',
  borderRadius: radius.pill,
  padding: '8px 16px',
  cursor: 'pointer',
};

const tabInactive = {
  ...tabActive,
  color: color.muted,
  background: 'transparent',
  border: `1px solid ${color.line}`,
};