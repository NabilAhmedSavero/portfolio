import type { Metadata } from "next";
import { WorkGallery } from "@/components/work-gallery";
import { createWorkSlides } from "@/data/projects";
import { getWorkProjects } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const projects = await getWorkProjects();

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-32 md:pb-36">
      <h1 className="sr-only">Work</h1>
      <WorkGallery items={createWorkSlides(projects)} />
    </div>
  );
}
