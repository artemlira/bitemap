import { revalidateTag } from "next/cache";
import { WORDPRESS_TAG } from "@/entities/fishing-article/server";

// WordPress calls this (for example from a "post published" webhook) so new articles show up at once.
// Send POST with the header `x-revalidate-secret: <REVALIDATE_SECRET>`.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  revalidateTag(WORDPRESS_TAG, "max");
  return Response.json({ revalidated: true });
}
