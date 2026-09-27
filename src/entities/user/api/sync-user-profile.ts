import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/shared/api/firebase";
import type { PublicUserProfile, UserProfile } from "../model/types";

function getProfileFields(user: User): UserProfile {
  return {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    providerIds: user.providerData.map((provider) => provider.providerId),
  };
}

function getPublicProfileFields(user: User): PublicUserProfile {
  return {
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export async function syncUserProfile(user: User) {
  const firestore = getFirebaseFirestore();
  const profileReference = doc(firestore, "users", user.uid);
  const publicProfileReference = doc(firestore, "public-profiles", user.uid);
  const profileSnapshot = await getDoc(profileReference);
  const profileFields = getProfileFields(user);

  if (!profileSnapshot.exists()) {
    await setDoc(profileReference, {
      ...profileFields,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(profileReference, {
      ...profileFields,
      updatedAt: serverTimestamp(),
    });
  }

  await setDoc(
    publicProfileReference,
    {
      ...getPublicProfileFields(user),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function ensurePublicUserProfile(user: User) {
  const publicProfileReference = doc(getFirebaseFirestore(), "public-profiles", user.uid);
  const publicProfileSnapshot = await getDoc(publicProfileReference);

  if (!publicProfileSnapshot.exists()) {
    await setDoc(publicProfileReference, {
      ...getPublicProfileFields(user),
      updatedAt: serverTimestamp(),
    });
  }
}
