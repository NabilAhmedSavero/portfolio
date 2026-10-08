import type { Metadata } from "next";
import { WorkItem } from "@/components/work-item";
import { getWorkProjects } from "@/sanity/lib/content";

export const metadata: Metadata = {
  title: "Work",
};

export default async function WorkPage() {
  const projects = await getWorkProjects();

  return (
    <div className="page-stack">
      <h1>Work</h1>
      <ul aria-label="Projects" className="work-collection">
        {projects.map((project) => (
          <li key={project.id}>
            <WorkItem project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
