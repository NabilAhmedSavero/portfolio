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
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-24">
      <h1 className="sr-only">Work</h1>
      <WorkGallery items={createWorkSlides(projects)} />
    </div>
  );
}
