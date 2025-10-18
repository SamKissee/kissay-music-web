import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import { LINKS, PLATFORM_NAMES } from "@/constants/links";
import { SOUNDCLOUD, SPOTIFY, YOUTUBE } from "@/constants/embeds";
import {
  FaSpotify,
  FaApple,
  FaSoundcloud,
  FaBandcamp,
  FaYoutube,
} from "react-icons/fa";

export default function Music() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />

      <PageHeader title="Music" />

      <main className="relative max-w-4xl mx-auto px-6 pb-32">
        <div className="space-y-6 mb-10">
          <h2 className="text-3xl font-bold text-white text-center">
            Listen On Your Favorite Platform
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={LINKS.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaSpotify className="text-2xl" />
              {PLATFORM_NAMES.spotify}
            </a>
            <a
              href={LINKS.appleMusic}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaApple className="text-2xl" />
              {PLATFORM_NAMES.appleMusic}
            </a>
            <a
              href={LINKS.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaSoundcloud className="text-2xl" />
              {PLATFORM_NAMES.soundcloud}
            </a>
            <a
              href={LINKS.bandcamp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <FaBandcamp className="text-2xl" />
              {PLATFORM_NAMES.bandcamp}
            </a>
          </div>
        </div>
        <div className="space-y-12">
          {/* Music Players */}
          <div className="space-y-8">
            {/* Spotify Embed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaSpotify className="text-3xl" />
                Spotify
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: SPOTIFY }}
              />
            </div>

            {/* SoundCloud Embed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaSoundcloud className="text-3xl" />
                SoundCloud
              </h2>
              <div
                className="rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: SOUNDCLOUD }}
              />
            </div>

            {/* YouTube Embed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaYoutube className="text-3xl" />
                YouTube
              </h2>
              <div
                className="aspect-video rounded-2xl overflow-hidden"
                dangerouslySetInnerHTML={{ __html: YOUTUBE }}
              />
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
