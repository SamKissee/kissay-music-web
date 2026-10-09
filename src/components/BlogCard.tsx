import Link from "next/link";
import Image from "next/image";
import {
  type BlogPostSummary,
  CATEGORY_LABELS,
  formatPostDate,
  getCoverImage,
} from "@/lib/hygraph";

interface BlogCardProps {
  post: BlogPostSummary;
  priority?: boolean;
}

export default function BlogCard({ post, priority = false }: BlogCardProps) {
  const cover = getCoverImage(post);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-page-accent">
        {cover ? (
          <Image
            src={cover}
            alt={post.coverImage?.alt ?? post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-page-primary/30 via-page-bg to-black">
            <span className="text-display text-4xl text-white/20">KISSAY</span>
          </div>
        )}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-md">
            {CATEGORY_LABELS[post.category]}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-2 text-body-sm text-white/50">
          <time dateTime={post.date ?? undefined}>
            {formatPostDate(post.date)}
          </time>
          {post.author?.name && (
            <>
              <span aria-hidden>·</span>
              <span>{post.author.name}</span>
            </>
          )}
        </div>

        <h3 className="text-heading-sm font-semibold text-white transition-colors group-hover:text-page-primary">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="line-clamp-3 text-body text-white/70">{post.excerpt}</p>
        )}

        <span className="mt-auto pt-2 text-body-sm font-semibold text-page-primary">
          Read article →
        </span>
      </div>
    </Link>
  );
}
