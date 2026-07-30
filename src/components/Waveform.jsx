import { color } from '../styles/tokens';

// Signature element: a waveform rule that stands in for the horizontal
// dividers you'd see on any editorial site, but built from the material
// GlobalLYNK actually works with — audio. Bar heights are seeded per
// instance so each placement on the page reads as a distinct "clip"
// rather than a repeated decoration.
function seededBars(seed, count) {
  let x = seed;
  const next = () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
  return Array.from({ length: count }, () => 0.15 + next() * 0.85);
}

export default function Waveform({ seed = 1, height = 32, barCount = 64, muted = false }) {
  const bars = seededBars(seed, barCount);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        height: `${height}px`,
        width: '100%',
      }}
      aria-hidden="true"
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${Math.max(h * height, 2)}px`,
            background: muted ? color.line : color.cyanDim,
            opacity: muted ? 1 : 0.4 + h * 0.6,
            borderRadius: '1px',
          }}
        />
      ))}
    </div>
  );
}
