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

export const getWorkProjects = cache(async (): Promise<readonly Project[]> => {
  function originalAspectRatio(image: ContentImage | null | undefined): number | undefined {
    const dimensions = image?.asset?._ref?.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
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

  // An empty successful response remains empty after the editor has activated CMS work.
  return cmsProjects.flatMap((project) => {
    if (!project.name?.trim()) return [];
    const coverUrl = imageUrl(project.coverImage, true);
    const externalUrl = safeHref(project.externalUrl);

    return [{
      id: project._id,
      name: project.name,
      subtitle: project.subtitle || "Subtitle placeholder — project description to be added.",
      image: {
        src: coverUrl || "/images/work-placeholder.svg",
        alt: coverUrl
          ? project.coverImage?.alt || project.name
          : `Project image placeholder for ${project.name}`,
        aspectRatio: coverUrl ? originalAspectRatio(project.coverImage) : 1.6,
      },
      additionalImages: (project.additionalImages ?? []).flatMap((image) => {
        const src = imageUrl(image, true);
        return src ? [{ id: image._key, src, alt: image.alt || project.name!, aspectRatio: originalAspectRatio(image) }] : [];
      }),
      ...(externalUrl ? { externalUrl } : {}),
    }];
  });
});
