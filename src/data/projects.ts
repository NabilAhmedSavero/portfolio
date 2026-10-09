export type Project = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: {
    src: string;
    alt: string;
    aspectRatio?: number;
  };
  additionalImages?: readonly {
    id: string;
    src: string;
    alt: string;
    aspectRatio?: number;
  }[];
};

export type WorkSlide = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: Project["image"];
};

/** One collection of images, preserving project and CMS image order. */
export function createWorkSlides(items: readonly Project[]): WorkSlide[] {
  return items.flatMap((project) => [
    { id: "cover", ...project.image },
    ...(project.additionalImages ?? []),
  ].map((image) => ({
    id: `${project.id}:${image.id}`,
    name: project.name,
    subtitle: project.subtitle,
    ...(project.externalUrl ? { externalUrl: project.externalUrl } : {}),
    image: { src: image.src, alt: image.alt, aspectRatio: image.aspectRatio },
  })));
}

// A single collection for all work. Replace subtitles and images with supplied content.
export const projects: readonly Project[] = [
  {
    id: "plied",
    name: "Plied",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Plied",
      aspectRatio: 1.6,
    },
  },
  {
    id: "faction",
    name: "Faction",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Faction",
      aspectRatio: 1.6,
    },
  },
  {
    id: "kumala-sari",
    name: "Kumala Sari",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Kumala Sari",
      aspectRatio: 1.6,
    },
  },
  {
    id: "evaware",
    name: "Evaware",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Evaware",
      aspectRatio: 1.6,
    },
  },
  {
    id: "ai-note-taking-app",
    name: "AI note-taking app",
    subtitle: "Subtitle placeholder — product description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for AI note-taking app",
      aspectRatio: 1.6,
    },
  },
  {
    id: "scribe",
    name: "Scribe",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Scribe",
      aspectRatio: 1.6,
    },
  },
];
