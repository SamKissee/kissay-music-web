'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function BackgroundImage() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background Image with effects */}
      <div className="relative w-full h-full">
        <motion.div
          className="relative w-full h-full"
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: 'transform' }}
        >
          <Image
            src="/kissay_bg.jpg"
            alt="Kissay Background"
            fill
            priority
            quality={100}
            className="object-cover"
            style={{ filter: isHovered ? 'brightness(1.1)' : 'brightness(1)' }}
          />
        </motion.div>

        {/* Gradient overlay for depth */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
          animate={{ opacity: isHovered ? 0.7 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30" />

        {/* Subtle animated grain texture overlay */}
        <motion.div
          className="absolute inset-0 mix-blend-overlay"
          animate={{ opacity: isHovered ? 0.04 : 0.02 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>
    </motion.div>
  );
}
