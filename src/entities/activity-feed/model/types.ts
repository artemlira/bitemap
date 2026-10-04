import type { FishingReport } from "@/entities/fishing-report";
import type { SpotImage } from "@/entities/spot-image";
import type { UserSpot } from "@/entities/user-spot";

export type FeedAuthor = {
  id: string;
  name: string;
  photoURL: string | null;
};

export type FeedActivity =
  | { author: FeedAuthor; createdAt: number; id: string; report: FishingReport; type: "report"; targetHref: string; targetName: string }
  | { author: FeedAuthor; createdAt: number; id: string; spot: UserSpot; type: "spot" }
  | { author: FeedAuthor; createdAt: number; id: string; image: SpotImage; type: "image"; targetHref: string; targetName: string };
