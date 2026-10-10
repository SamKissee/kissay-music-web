import Link from "next/link";
import Image from "next/image";
import { formatReleaseDate, type Release } from "@/lib/releases";

interface Props {
  release: Release;
  priority?: boolean;
  sizes?: string;
}

export default function ReleaseCard({
  release,
  priority = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
}: Props) {
  return (
    <Link href={`/releases/${release.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        {release.coverImage?.url ? (
          <Image
            src={release.coverImage.url}
            alt={`${release.title} cover art`}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-page-primary/30 via-page-bg to-black">
            <span className="text-display text-3xl text-white/20">KISSAY</span>
          </div>
        )}
      </div>
      <h3 className="mt-3 text-body font-semibold text-white transition-colors group-hover:text-page-primary">
        {release.title}
      </h3>
      {release.releaseDate && (
        <time
          dateTime={release.releaseDate}
          className="text-body-sm text-white/50"
        >
          {formatReleaseDate(release.releaseDate)}
        </time>
      )}
    </Link>
  );
}
