import type { Metadata } from "next";

export const noIndexMetadata: Pick<Metadata, "robots"> = {
  robots: { index: false, follow: false },
};
