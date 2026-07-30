import { color } from '../styles/tokens';

export default function GradientOrb({ size = 420, style = {}, seed = 1 }) {
  const pairs = [
    [color.cyan, color.purple],
    [color.purple, color.pink],
    [color.pink, color.cyan],
  ];
  const [from, to] = pairs[seed % pairs.length];
  const posX = 25 + ((seed * 13) % 30);
  const posY = 25 + ((seed * 7) % 30);

  return (
    <div style={{ position: 'relative', width: size, height: size, pointerEvents: 'none', ...style }} aria-hidden="true">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at ${posX}% ${posY}%, ${from}, ${to} 60%, transparent 80%)`,
          filter: 'blur(80px)',
          opacity: 0.22,
          animation: 'lynk-orb-drift 14s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes lynk-orb-drift {
          0%, 100% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(10px, -14px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden="true"] div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}