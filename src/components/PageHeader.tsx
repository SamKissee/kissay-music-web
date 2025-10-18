'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="w-full px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Layout: Logo left, Title right */}
        <div className="hidden sm:flex items-center justify-between">
          <Link href="/" className="group">
            <div className="h-12 lg:h-14 relative transition-all duration-300 group-hover:scale-110 drop-shadow-lg">
              <Image
                src="/kissaylogo.png"
                alt="Kissay Logo"
                width={200}
                height={200}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg uppercase">
            {title}
          </h1>
        </div>

        {/* Mobile Layout: Stacked and centered */}
        <div className="sm:hidden flex flex-col items-center gap-4">
          <Link href="/" className="group">
            <div className="h-10 relative transition-all duration-300 group-hover:scale-110 drop-shadow-lg">
              <Image
                src="/kissaylogo.png"
                alt="Kissay Logo"
                width={200}
                height={200}
                priority
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg uppercase">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
