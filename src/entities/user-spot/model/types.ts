export type UserSpotTone = "lagoon" | "reeds" | "river" | "sunset";

export type UserSpot = {
  access: string;
  description: string;
  fish: string[];
  id: string;
  name: string;
  ownerId: string;
  region: string;
  tone: UserSpotTone;
  waterType: string;
};

export type UserSpotFormValues = {
  access: string;
  description: string;
  fish: string;
  name: string;
  region: string;
  tone: UserSpotTone;
  waterType: string;
};
