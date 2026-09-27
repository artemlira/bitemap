export type FishingReportTargetType = "catalog" | "user-spot";

export type FishingReportEnglishTranslation = Partial<{
  bait: string;
  fish: string[];
  impression: string;
  method: string;
}>;

export type FishingActivity = "excellent" | "good" | "fair" | "low";

export type FishingReport = {
  activity?: FishingActivity;
  authorId: string;
  authorName: string;
  bait?: string;
  fish: string[];
  id: string;
  impression: string;
  method: string;
  isPublic?: boolean;
  rating: number;
  targetId: string;
  targetType: FishingReportTargetType;
  tripDate: string;
  translations?: {
    en?: FishingReportEnglishTranslation;
  };
};
