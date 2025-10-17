'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function BackgroundImage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image with effects */}
      <div className="relative w-full h-full">
        <Image
          src="/kissay_bg.jpg"
          alt="Kissay Background"
          fill
          priority
          quality={100}
          className={`object-cover transition-all duration-700 ease-out ${
            isHovered ? 'scale-105 brightness-110' : 'scale-100 brightness-100'
          }`}
        />

        {/* Gradient overlay for depth */}
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 transition-opacity duration-700 ${
            isHovered ? 'opacity-70' : 'opacity-100'
          }`}
        />

        {/* Vignette effect */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30" />

        {/* Subtle animated grain texture overlay */}
        <div
          className={`absolute inset-0 opacity-[0.02] mix-blend-overlay transition-opacity duration-500 ${
            isHovered ? 'opacity-[0.04]' : 'opacity-[0.02]'
          }`}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />
      </div>
    </div>
  );
}
