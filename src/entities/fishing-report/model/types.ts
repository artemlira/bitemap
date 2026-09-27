export type FishingReportTargetType = "catalog" | "user-spot";

export type FishingReportEnglishTranslation = Partial<{
  fish: string[];
  impression: string;
  method: string;
}>;

export type FishingReport = {
  authorId: string;
  authorName: string;
  fish: string[];
  id: string;
  impression: string;
  method: string;
  rating: number;
  targetId: string;
  targetType: FishingReportTargetType;
  tripDate: string;
  translations?: {
    en?: FishingReportEnglishTranslation;
  };
};
