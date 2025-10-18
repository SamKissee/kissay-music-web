'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth motion
      }}
      style={{
        willChange: 'opacity',
      }}
    >
      {children}
    </motion.div>
  );
}
