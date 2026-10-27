import "server-only";

import { cache } from "react";
import { projects, type Project } from "@/data/projects";
import type { ContentImage, EXPERIENCE_QUERY_RESULT, PROJECTS_QUERY_RESULT, SITE_CONTENT_QUERY_RESULT } from "../types";
import { fetchPublished } from "./client";
import { imageUrl } from "./images";
import { safeHref } from "./links";
import { EXPERIENCE_QUERY, PROJECTS_QUERY, SITE_CONTENT_QUERY } from "./queries";

export const getSiteContent = cache(() => fetchPublished<SITE_CONTENT_QUERY_RESULT>(SITE_CONTENT_QUERY));

export const getExperiences = cache(async () =>
  (await fetchPublished<EXPERIENCE_QUERY_RESULT>(EXPERIENCE_QUERY)) ?? [],
);

export const getProjectDocuments = cache(() => fetchPublished<PROJECTS_QUERY_RESULT>(PROJECTS_QUERY));

type SanityItemWithAsset = {
  asset?: { _ref?: string };
  _key?: string;
  alt?: string;
};

export const getWorkProjects = cache(async (): Promise<readonly Project[]> => {
  function originalAspectRatio(image: SanityItemWithAsset | ContentImage | null | undefined): number | undefined {
    const ref = image && typeof image === "object" && "asset" in image ? image.asset?._ref : undefined;
    const dimensions = ref?.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
    if (!dimensions) return undefined;

    const width = Number(dimensions[1]);
    const height = Number(dimensions[2]);
    const ratio = width / height;
    return Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0 && Number.isFinite(ratio) && ratio > 0
      ? ratio
      : undefined;
  }

  const cmsProjects = await getProjectDocuments();
  if (!cmsProjects || cmsProjects.length === 0) return projects;

  return cmsProjects.flatMap((project) => {
    const title = project.title || "";
    if (!title.trim()) return [];
    const externalUrl = safeHref(project.externalUrl);

    // Normalize images: project.images or legacy coverImage / additionalImages
    const rawImages: SanityItemWithAsset[] =
      Array.isArray(project.images) && project.images.length > 0
        ? (project.images as SanityItemWithAsset[])
        : ([project.coverImage, ...(project.additionalImages ?? [])].filter(Boolean) as SanityItemWithAsset[]);

    const images = rawImages.flatMap((img, idx) => {
      const src = imageUrl(img, true);
      if (!src) return [];
      return [
        {
          id: img?._key || `img-${idx}`,
          src,
          fullSrc: imageUrl(img) || src,
          alt: img?.alt || title,
          aspectRatio: originalAspectRatio(img) || 1.6,
        },
      ];
    });

    const primaryImage = images[0] || {
      id: "placeholder",
      src: "/images/work-placeholder.svg",
      fullSrc: "/images/work-placeholder.svg",
      alt: `Project image placeholder for ${title}`,
      aspectRatio: 1.6,
    };

    const finalImages = images.length > 0 ? images : [primaryImage];

    return [
      {
        id: project._id,
        title,
        name: title,
        subtitle: project.subtitle || "Subtitle placeholder — project description to be added.",
        order: project.order ?? 0,
        images: finalImages,
        image: primaryImage,
        additionalImages: finalImages.slice(1),
        ...(externalUrl ? { externalUrl } : {}),
      },
    ];
  });
});
