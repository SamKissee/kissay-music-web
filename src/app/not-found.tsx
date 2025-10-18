import Link from "next/link";
import BackgroundImage from "@/components/BackgroundImage";
import BottomNav from "@/components/BottomNav";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <main className="relative flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center space-y-8">
          <h1 className="text-display text-heading-xl text-white drop-shadow-lg">
            404
          </h1>
          <h2 className="text-display text-heading-lg text-white/90">
            Page Not Found
          </h2>
          <p className="text-body-lg text-white/80 max-w-md">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-body"
          >
            Go Home
          </Link>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
