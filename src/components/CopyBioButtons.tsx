"use client";

import { useState } from "react";

interface CopyBioButtonsProps {
  fullBio: string;
  shortBio: string;
}

export default function CopyBioButtons({ fullBio, shortBio }: CopyBioButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Copy Bio Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => copyToClipboard(fullBio)}
          className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-body"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
          {copied ? "Copied!" : "Copy Full Bio"}
        </button>

        <button
          onClick={() => copyToClipboard(shortBio)}
          className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-body"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
            />
          </svg>
          Copy Short Bio
        </button>
      </div>

      {/* Success Message */}
      {copied && (
        <div className="p-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white text-center font-medium">
          Bio copied to clipboard!
        </div>
      )}
    </div>
  );
}
