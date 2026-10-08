import "server-only";

import { cache } from "react";
import { projects, type Project } from "@/data/projects";
import type { EXPERIENCE_QUERY_RESULT, PROJECTS_QUERY_RESULT, SITE_CONTENT_QUERY_RESULT } from "../types";
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
  const site = await getSiteContent();
  if (site?.useCmsProjects !== true) return projects;

  const cmsProjects = await getProjectDocuments();
  if (cmsProjects === null) return projects;

  // An empty successful response remains empty after the editor has activated CMS work.
  return cmsProjects.flatMap((project) => {
    if (!project.name?.trim()) return [];
    const coverUrl = imageUrl(project.coverImage);
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
      },
      ...(externalUrl ? { externalUrl } : {}),
    }];
  });
});
