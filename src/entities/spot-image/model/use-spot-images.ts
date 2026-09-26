"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import type { SpotImage, SpotImageTargetType } from "./types";
import { getFirebaseFirestore } from "@/shared/api/firebase";

export function useSpotImages(targetType: SpotImageTargetType, targetId: string) {
  const [images, setImages] = useState<readonly SpotImage[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const imagesQuery = query(
      collection(getFirebaseFirestore(), "spot-images"),
      where("targetType", "==", targetType),
      where("targetId", "==", targetId),
    );

    return onSnapshot(
      imagesQuery,
      (snapshot) => {
        setImages(snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as SpotImage));
        setHasError(false);
      },
      () => {
        setImages([]);
        setHasError(true);
      },
    );
  }, [targetId, targetType]);

  return { hasError, images };
}
