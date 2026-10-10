import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, isSanityConfigured, projectId } from "../env";

const builder = isSanityConfigured ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}

export function imageUrl(image: SanityImageSource | null | undefined, preserveOriginal = false): string | null {
  if (!builder || !image) return null;

  try {
    const source = builder.image(image);
    return preserveOriginal
      ? source.ignoreImageParams().width(3200).fit("max").auto("format").url()
      : source.width(1600).auto("format").url();
  } catch {
    return null;
  }
}
