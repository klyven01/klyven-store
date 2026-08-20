import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Wraps a button/link so it subtly "pulls" toward the cursor on hover —
 * a common premium-feeling micro-interaction. Disabled entirely on touch
 * devices and when the visitor prefers reduced motion.
 *
 * Usage: <MagneticButton><Link to="/shop" className="...">Shop</Link></MagneticButton>
 */
export default function MagneticButton({ children, strength = 0.25, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  if (reduce) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.2 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
