export type UserSpotTone = "lagoon" | "reeds" | "river" | "sunset";
export type UserSpotVisibility = "private" | "published";

export type UserSpotEnglishTranslation = Partial<{
  access: string;
  description: string;
  fish: string[];
  name: string;
  waterType: string;
}>;

export type UserSpot = {
  access: string;
  description: string;
  fish: string[];
  id: string;
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
  waterType: string;
  translations?: {
    en?: UserSpotEnglishTranslation;
  };
};

export type UserSpotFormValues = {
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
  nameEn: string;
  waterTypeEn: string;
};
