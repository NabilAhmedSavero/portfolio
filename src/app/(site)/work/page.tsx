import type { Metadata } from "next";
import { WorkGallery } from "@/components/work-gallery";
import { createWorkSlides } from "@/data/projects";
import { getWorkProjects } from "@/sanity/lib/content";
import "./work.css";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const projects = await getWorkProjects();

  return (
    <div className="work-gallery-page">
      <h1 className="sr-only">Work</h1>
      <WorkGallery items={createWorkSlides(projects)} />
    </div>
  );
}
