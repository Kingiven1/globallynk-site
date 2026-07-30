import { color } from '../styles/tokens';

export default function GradientOrb({ size = 420, style = {}, seed = 1 }) {
  const angle = (seed * 47) % 360;
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `conic-gradient(from ${angle}deg, ${color.cyan}, ${color.purple}, ${color.pink}, ${color.cyan})`,
          filter: 'blur(60px)',
          opacity: 0.35,
          animation: 'lynk-orb-drift 12s ease-in-out infinite',
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