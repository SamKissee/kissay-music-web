'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <motion.div
        className="pointer-events-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Logo with glow effect */}
        <div className="relative">
          {/* Glow background */}
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
          />

          {/* Logo image with floating animation */}
          <motion.div
            className="relative"
            animate={
              prefersReducedMotion
                ? {}
                : isHovered
                ? { y: 0 }
                : { y: [0, -10, 0] }
            }
            transition={
              isHovered
                ? { duration: 0.3 }
                : {
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            style={{ willChange: 'transform' }}
          >
            <motion.div
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isHovered
                  ? 'brightness(1.1) saturate(1.1) drop-shadow(0 0 30px rgba(255,255,255,0.5))'
                  : 'brightness(1) saturate(1) drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/kissaylogo.png"
                alt="Kissay Logo"
                width={400}
                height={400}
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
