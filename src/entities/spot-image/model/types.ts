export type SpotImageTargetType = "catalog" | "user-spot";
export type MediaUploadTargetType = SpotImageTargetType | "article" | "fishing-report";

export type SpotImage = {
  caption: {
    en?: string;
    uk: string;
  };
  id: string;
  ownerId: string;
  storagePath: string;
  targetId: string;
  targetType: SpotImageTargetType;
  url: string;
};
