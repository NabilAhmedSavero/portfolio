import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { WorkGallery, type SanityProject } from "@/components/work-gallery";
import { projects as fallbackProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

const WORK_PROJECTS_QUERY = `
  *[_type == "project" && (isVisible == true || !defined(isVisible)) && !(_id in path("drafts.**"))]
  | order(displayOrder asc, _createdAt desc) {
    _id,
    name,
    title,
    subtitle,
    coverImage,
    mainImage,
    additionalImages,
    externalUrl,
    displayOrder
  }
`;

export default async function WorkPage() {
  let sanityProjects: SanityProject[] = [];

  if (client) {
    try {
      sanityProjects = await client.fetch<SanityProject[]>(
        WORK_PROJECTS_QUERY,
        {},
        { next: { revalidate: 0 } }
      );
    } catch (error) {
      console.warn("[Sanity] Failed to fetch projects on work page:", error);
    }
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-24">
      <h1 className="sr-only">Work</h1>
      <WorkGallery projects={sanityProjects} fallbackProjects={fallbackProjects} />
    </div>
  );
}
