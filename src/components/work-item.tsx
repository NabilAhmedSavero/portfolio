import Image from "next/image";
import type { Project } from "@/data/projects";

type WorkItemProps = {
  project: Project;
};

export function WorkItem({ project }: WorkItemProps) {
  const headingId = `${project.id}-heading`;

  return (
    <article aria-labelledby={headingId}>
      <figure className="work-item">
        <div className="work-image-frame">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="work-caption">
          <h2 id={headingId}>
            {project.externalUrl ? (
              <a href={project.externalUrl} className="underline underline-offset-4">{project.name}</a>
            ) : project.name}
          </h2>
          <p className="text-muted">{project.subtitle}</p>
        </figcaption>
      </figure>
    </article>
  );
}
