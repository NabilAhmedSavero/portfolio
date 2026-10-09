import type { Metadata } from "next";
import { WorkCanvas } from "@/components/work-canvas";
import { createWorkSlides } from "@/data/projects";
import { getWorkProjects } from "@/sanity/lib/content";
import "./work.css";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const projects = await getWorkProjects();

  return (
    <div className="work-canvas-page">
      <h1 className="sr-only">Work</h1>
      <WorkCanvas items={createWorkSlides(projects)} />
    </div>
  );
}
