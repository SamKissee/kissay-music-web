import BottomNav from "@/components/BottomNav";
import { LINKS, PLATFORM_NAMES } from "@/constants/links";

export default function Music() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <main className="max-w-4xl mx-auto px-6 py-12 pb-32">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Music
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent mx-auto" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Listen to my latest releases
            </p>
          </div>

          {/* Featured Release */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-500/30 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="white" className="w-24 h-24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-2">
                  FEATURED RELEASE
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Latest Single/Album
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Add your featured release title and description here
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
                  Listen Now
                </button>
              </div>
            </div>
          </div>

          {/* Releases Grid */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Discography
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500 dark:text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
                        Track/Album Title {item}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Release Year
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          3:45
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streaming Platforms */}
          <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-white/10 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Stream on Your Favorite Platform
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={LINKS.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {PLATFORM_NAMES.spotify}
              </a>
              <a
                href={LINKS.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {PLATFORM_NAMES.appleMusic}
              </a>
              <a
                href={LINKS.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {PLATFORM_NAMES.soundcloud}
              </a>
              <a
                href={LINKS.bandcamp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {PLATFORM_NAMES.bandcamp}
              </a>
            </div>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
