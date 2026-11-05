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
  | order(coalesce(order, displayOrder, 0) asc, _createdAt desc) {
    _id,
    "title": coalesce(title, name, ""),
    subtitle,
    "order": coalesce(order, displayOrder, 0),
    "images": select(
      defined(images) && count(images) > 0 => images[]{
        ...,
        "dimensions": asset->metadata.dimensions
      },
      defined(image) => [image{
        ...,
        "dimensions": asset->metadata.dimensions
      }],
      defined(coverImage) => [coverImage{
        ...,
        "dimensions": asset->metadata.dimensions
      }],
      defined(mainImage) => [mainImage{
        ...,
        "dimensions": asset->metadata.dimensions
      }],
      []
    ),
    "image": image{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    "coverImage": coverImage{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    "additionalImages": additionalImages[]{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    externalUrl
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
    <div className="w-full max-w-full px-6 md:px-16 lg:px-24 pt-14 md:pt-[88px] pb-20 sm:pb-24">
      <h1 className="sr-only">Work</h1>
      <WorkGallery projects={sanityProjects} fallbackProjects={fallbackProjects} />
    </div>
  );
}
