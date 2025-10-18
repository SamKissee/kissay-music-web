"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  {
    src: "/kissay-pics/444924124_1183187229524256_959241266949786557_n (1).jpg",
    alt: "Kissay performance 1",
  },
  {
    src: "/kissay-pics/489927120_1428749184968058_9141879203726492502_n.jpg",
    alt: "Kissay performance 2",
  },
  {
    src: "/kissay-pics/490020467_1430524831457160_4738539659000015258_n.jpg",
    alt: "Kissay performance 3",
  },
  {
    src: "/kissay-pics/515141234_18513625861040332_605361886305340152_n.jpg",
    alt: "Kissay performance 4",
  },
  {
    src: "/kissay-pics/521290474_18516035818040332_6178592565018933659_n.jpg",
    alt: "Kissay performance 5",
  },
];

export default function ImageGrid() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <div className="space-y-8">
        <div className="border-t border-white/20 pt-8"></div>

        {/* Mobile-First Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {/* First image - spans 2 rows on mobile, featured */}
          <div
            className="col-span-2 row-span-2 relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => setSelectedImage(0)}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Second image - standard */}
          <div
            className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => setSelectedImage(1)}
          >
            <Image
              src={images[1].src}
              alt={images[1].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Third image - standard */}
          <div
            className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => setSelectedImage(2)}
          >
            <Image
              src={images[2].src}
              alt={images[2].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Fourth image - spans 2 columns on mobile */}
          <div
            className="col-span-2 md:col-span-1 relative aspect-square overflow-hidden rounded-2xl cursor-pointer group"
            onClick={() => setSelectedImage(3)}
          >
            <Image
              src={images[3].src}
              alt={images[3].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Fifth image - standard */}
          <div
            className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group md:col-span-1"
            onClick={() => setSelectedImage(4)}
          >
            <Image
              src={images[4].src}
              alt={images[4].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white text-4xl md:text-5xl font-light hover:scale-110 transition-transform z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              fill
              className="object-contain"
              sizes="100vw"
              quality={100}
            />
          </div>

          {/* Navigation */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-4">
            <button
              className="px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : (prev ?? 0) - 1
                );
              }}
              aria-label="Previous image"
            >
              ← Previous
            </button>
            <button
              className="px-4 md:px-6 py-2 md:py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) =>
                  prev === images.length - 1 ? 0 : (prev ?? 0) + 1
                );
              }}
              aria-label="Next image"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
