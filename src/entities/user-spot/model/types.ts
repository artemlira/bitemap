export type UserSpotTone = "lagoon" | "reeds" | "river" | "sunset";
export type UserSpotVisibility = "private" | "published";
export type UserSpotAccessCategory = "free" | "paid" | "restricted" | "unknown";
export type UserSpotVerificationStatus = "community-reported" | "verified" | "unverified";

export type UserSpotEnglishTranslation = Partial<{
  access: string;
  description: string;
  fish: string[];
  name: string;
  waterType: string;
}>;

export type UserSpot = {
  accessCategory?: UserSpotAccessCategory;
  access: string;
  description: string;
  fish: string[];
  id: string;
  latitude?: number;
  longitude?: number;
  name: string;
  ownerId: string;
  region: string;
  regionId?: string;
  community?: string;
  communityId?: string;
  settlement?: string;
  settlementId?: string;
  tone: UserSpotTone;
  visibility: UserSpotVisibility;
  verificationStatus?: UserSpotVerificationStatus;
  updatedAt?: Date;
  waterType: string;
  translations?: {
    en?: UserSpotEnglishTranslation;
  };
};

export type UserSpotFormValues = {
  accessCategory: UserSpotAccessCategory;
  access: string;
  description: string;
  fish: string;
  name: string;
  region: string;
  regionId: string;
  community: string;
  communityId: string;
  settlement: string;
  settlementId: string;
  tone: UserSpotTone;
  visibility: UserSpotVisibility;
  waterType: string;
  accessEn: string;
  descriptionEn: string;
  fishEn: string;
  latitude: number | null;
  longitude: number | null;
  nameEn: string;
  waterTypeEn: string;
};
