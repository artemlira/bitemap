import type { ManagedFishingArticle } from "./types";

// Server-side reader for a WordPress site used as the editorial CMS.
// Set WORDPRESS_URL (for example https://cms.example.com) to turn it on; without it no
// WordPress articles are shown and nothing else changes.

type WordPressPost = {
  id: number;
  slug: string;
  date_gmt: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: { "wp:term"?: { name: string }[][] };
};

export const WORDPRESS_TAG = "wordpress";
const PREFIX = "wp-";
const TONES = ["lagoon", "sunset", "river"] as const;

const decode = (html: string) =>
  html
    .replace(/<[^>]*>/g, "")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8230;|&hellip;/g, "…")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Splits post HTML at <h2> so the article page can build a table of contents. */
function toSections(title: string, html: string) {
  const parts = html.split(/(?=<h2[\s>])/i).filter((part) => part.trim());
  return parts.map((part, index) => {
    const match = /^<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(part);
    return match
      ? { heading: decode(match[1]), contentHtml: part.slice(match[0].length) }
      : { heading: index === 0 ? title : "", contentHtml: part };
  });
}

function toArticle(post: WordPressPost): ManagedFishingArticle {
  const title = decode(post.title.rendered);
  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "";
  const translation = {
    title,
    excerpt: decode(post.excerpt.rendered),
    category,
    sections: toSections(title, post.content.rendered),
  };
  const words = decode(post.content.rendered).split(" ").length;

  return {
    slug: `${PREFIX}${post.slug}`,
    readMinutes: Math.max(1, Math.round(words / 200)),
    tone: TONES[post.id % TONES.length],
    translations: { uk: translation, en: translation },
    status: "published",
    authorId: "wordpress",
    updatedAt: Date.parse(post.date_gmt + "Z") || undefined,
  };
}

async function request(path: string) {
  const base = process.env.WORDPRESS_URL?.replace(/\/$/, "");
  if (!base) return null;

  try {
    const response = await fetch(`${base}/wp-json/wp/v2/${path}`, { next: { revalidate: 600, tags: [WORDPRESS_TAG] } });
    return response.ok ? ((await response.json()) as WordPressPost[]) : null;
  } catch {
    return null;
  }
}

export async function getWordPressArticles(): Promise<ManagedFishingArticle[]> {
  const posts = await request("posts?_embed=wp:term&per_page=30&_fields=id,slug,date_gmt,title,excerpt,content,_embedded");
  return posts ? posts.map(toArticle) : [];
}

export async function getWordPressArticle(slug: string): Promise<ManagedFishingArticle | undefined> {
  if (!slug.startsWith(PREFIX)) return undefined;
  const posts = await request(`posts?slug=${encodeURIComponent(slug.slice(PREFIX.length))}&_embed=wp:term`);
  return posts?.[0] ? toArticle(posts[0]) : undefined;
}
