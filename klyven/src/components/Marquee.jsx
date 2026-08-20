import { useReducedMotion } from 'framer-motion';

/**
 * Infinite scrolling text banner. Pure CSS animation (no framer-motion
 * needed for this one) — cheap to render, pauses automatically when
 * reduced motion is preferred.
 */
export default function Marquee({ text = 'KLYVEN • MOVE DIFFERENT • DROP 01' }) {
  const reduce = useReducedMotion();
  const repeated = Array(6).fill(text).join('  •  ');

  return (
    <div className="border-y border-line bg-ash overflow-hidden py-4">
      <div
        className={`whitespace-nowrap spec-tag text-steel ${reduce ? '' : 'animate-marquee'}`}
        style={{ display: 'inline-block', paddingLeft: '100%' }}
      >
        {repeated}
      </div>
    </div>
  );
}
