import { motion, useReducedMotion } from 'framer-motion';

/**
 * Wraps content to fade/slide in once it scrolls into view. Automatically
 * does nothing (renders instantly, no motion) if the visitor has
 * "reduce motion" enabled in their OS/browser settings.
 *
 * Usage: <Reveal><h2>Section title</h2></Reveal>
 * Stagger a group: <Reveal delay={0.1}>...</Reveal> per child.
 */
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
