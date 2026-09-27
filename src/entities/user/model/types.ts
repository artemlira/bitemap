export type UserProfile = {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  providerIds: string[];
};

export type PublicUserProfile = Pick<UserProfile, "displayName" | "photoURL">;
