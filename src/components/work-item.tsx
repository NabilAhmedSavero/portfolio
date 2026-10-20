import Image from "next/image";
import type { Project } from "@/data/projects";

type WorkItemProps = {
  project: Project;
};

export function WorkItem({ project }: WorkItemProps) {
  const headingId = `${project.id}-heading`;

  return (
    <article aria-labelledby={headingId} className="w-full max-w-[682px] mx-auto flex flex-col">
      <figure className="flex flex-col w-full m-0 p-0">
        <div className="w-full aspect-[3/2] relative overflow-hidden rounded-[8px] bg-[#f5f5f7] border border-[#232323]/10">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 682px"
            className="object-cover"
          />
        </div>
        <figcaption className="mt-3.5 md:mt-4 flex flex-col items-start text-left w-full gap-1">
          <h2 id={headingId} className="text-[16px] font-[500] text-neutral-900 leading-snug tracking-tight">
            {project.externalUrl ? (
              <a href={project.externalUrl} className="underline underline-offset-4">{project.name}</a>
            ) : project.name}
          </h2>
          {project.subtitle && (
            <p className="text-[14px] font-[400] leading-normal text-neutral-500">{project.subtitle}</p>
          )}
        </figcaption>
      </figure>
    </article>
  );
}
