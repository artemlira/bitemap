import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import type { UserProfile } from "../model/types";

function getProfileFields(user: User): UserProfile {
  return {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    providerIds: user.providerData.map((provider) => provider.providerId),
  };
}

export async function syncUserProfile(user: User) {
  const profileReference = doc(getFirebaseFirestore(), "users", user.uid);
  const profileSnapshot = await getDoc(profileReference);
  const profileFields = getProfileFields(user);

  if (!profileSnapshot.exists()) {
    await setDoc(profileReference, {
      ...profileFields,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return;
  }

  await updateDoc(profileReference, {
    ...profileFields,
    updatedAt: serverTimestamp(),
  });
}
