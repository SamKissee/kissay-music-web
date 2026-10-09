import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import BackgroundImage from "@/components/BackgroundImage";
import BlogCard from "@/components/BlogCard";
import {
  getBlogPosts,
  CATEGORY_LABELS,
  formatPostDate,
  getCoverImage,
} from "@/lib/hygraph";

export const metadata: Metadata = {
  title: "Blog - News, Releases & Sound Design",
  description:
    "Read the latest from Kissay - release breakdowns, sound design tutorials, behind-the-scenes stories, gear talk, and news from the Northwest bass music scene.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog - Kissay | News, Releases & Sound Design",
    description:
      "Release breakdowns, sound design tutorials, behind-the-scenes stories, and news from Kissay.",
    url: "/blog",
    images: ["/kissay_social_share.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Kissay | News, Releases & Sound Design",
    description:
      "Release breakdowns, sound design tutorials, and news from Kissay.",
    images: ["/kissay_social_share.webp"],
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);
  const featuredCover = featured ? getCoverImage(featured) : null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundImage />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative z-10">
        <PageHeader title="Blog" />

      <main className="relative mx-auto max-w-7xl px-6 pb-32">
        {posts.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-md">
            <h2 className="text-heading-md text-display text-white">
              No posts yet
            </h2>
            <p className="mt-4 text-body text-white/70">
              New stories, release notes, and tutorials are on the way. Check
              back soon.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group mb-16 block overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/25"
              >
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-[24rem]">
                    {featuredCover ? (
                      <Image
                        src={featuredCover}
                        alt={featured.coverImage?.alt ?? featured.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full min-h-[18rem] w-full items-center justify-center bg-gradient-to-br from-page-primary/30 via-page-bg to-black">
                        <span className="text-display text-6xl text-white/20">
                          KISSAY
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-page-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                        Featured
                      </span>
                      {featured.category && (
                        <span className="text-body-sm uppercase tracking-wide text-white/60">
                          {CATEGORY_LABELS[featured.category]}
                        </span>
                      )}
                    </div>

                    <h2 className="text-display text-heading-lg text-white transition-colors group-hover:text-page-primary">
                      {featured.title}
                    </h2>

                    {featured.excerpt && (
                      <p className="text-body-lg text-white/75">
                        {featured.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-body-sm text-white/50">
                      <time dateTime={featured.date ?? undefined}>
                        {formatPostDate(featured.date)}
                      </time>
                      {featured.author?.name && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{featured.author.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <BlogCard key={post.id} post={post} priority={i < 3} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      </div>

      <BottomNav />
    </div>
  );
}
