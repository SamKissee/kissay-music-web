/**
 * Client-side tracking helpers. Both IDs are optional: when an ID isn't set,
 * its script isn't loaded and these calls do nothing.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

/**
 * A visitor clicked a platform button on a release page.
 * Meta: ViewContent (the conversion the ads optimize for).
 * GA4: smart_link_click (mark it as a key event in GA).
 */
export function trackReleaseClick(params: {
  release: string;
  slug: string;
  platform: string;
}) {
  if (typeof window === "undefined") return;

  window.fbq?.("track", "ViewContent", {
    content_name: params.release,
    content_category: params.platform,
    content_ids: [params.slug],
    content_type: "product",
  });

  window.gtag?.("event", "smart_link_click", {
    release: params.slug,
    platform: params.platform,
    transport_type: "beacon",
  });
}
