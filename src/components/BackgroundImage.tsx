"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface BackgroundImageProps {
  isHomePage?: boolean;
}

export default function BackgroundImage({
  isHomePage = false,
}: BackgroundImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
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
          style={{ willChange: "transform" }}
        >
          <Image
            src="/kissay_bg.jpg"
            alt="Kissay Background"
            fill
            priority
            quality={100}
            className="object-cover"
            style={{ filter: isHovered ? "brightness(1.1)" : "brightness(1)" }}
          />
        </motion.div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30" />

        {/* Dark grainy gradient overlay for non-home pages */}
        {!isHomePage && (
          <div className="absolute inset-0">
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

            {/* Enhanced grain texture with darker aesthetic */}
            <div
              className="absolute inset-0 mix-blend-soft-light opacity-60"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
                backgroundSize: "200px 200px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
