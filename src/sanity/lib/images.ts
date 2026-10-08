import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

export function imageUrl(image: SanityImageSource | null | undefined): string | null {
  if (!builder || !image) return null;

  try {
    return builder.image(image).width(1600).auto("format").url();
  } catch {
    return null;
  }
}
