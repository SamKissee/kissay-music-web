'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Logo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
      <div
        className="pointer-events-auto cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo with glow effect */}
        <div className="relative">
          {/* Glow background */}
          <div
            className={`absolute inset-0 blur-3xl transition-all duration-500 ${
              isHovered ? 'opacity-60 scale-110' : 'opacity-30 scale-100'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            }}
          />

          {/* Logo image */}
          <div className="relative">
            <Image
              src="/kissaylogo.png"
              alt="Kissay Logo"
              width={400}
              height={400}
              priority
              className={`transition-all duration-500 ease-out drop-shadow-2xl ${
                isHovered
                  ? 'scale-110 brightness-110 saturate-110'
                  : 'scale-100 brightness-100 saturate-100'
              }`}
              style={{
                filter: isHovered
                  ? 'drop-shadow(0 0 30px rgba(255,255,255,0.5))'
                  : 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
              }}
            />
          </div>

          {/* Floating animation effect */}
          <div
            className={`absolute inset-0 transition-transform duration-[3000ms] ease-in-out ${
              isHovered ? 'translate-y-0' : 'animate-float'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
