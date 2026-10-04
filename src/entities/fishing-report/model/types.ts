export type FishingReportTargetType = "catalog" | "user-spot";

export type FishingReportEnglishTranslation = Partial<{
  bait: string;
  fish: string[];
  impression: string;
  method: string;
  rodSetup: string;
  conditions: string;
}>;

export type FishingActivity = "excellent" | "good" | "fair" | "low";

export type FishingReport = {
  activity?: FishingActivity;
  authorId: string;
  authorName: string;
  bait?: string;
  fish: string[];
  catchLengthCm?: number;
  catchWeightKg?: number;
  waterTemperatureC?: number;
  id: string;
  impression: string;
  method: string;
  rodSetup?: string;
  conditions?: string;
  photo?: { storagePath: string; url: string } | null;
  isPublic?: boolean;
  rating: number;
  targetId: string;
  targetType: FishingReportTargetType;
  tripDate: string;
  translations?: {
    en?: FishingReportEnglishTranslation;
  };
};
