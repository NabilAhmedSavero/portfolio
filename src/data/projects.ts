export type Project = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: {
    src: string;
    alt: string;
  };
};

// A single collection for all work. Replace subtitles and images with supplied content.
export const projects: readonly Project[] = [
  {
    id: "plied",
    name: "Plied",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Plied",
    },
  },
  {
    id: "faction",
    name: "Faction",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Faction",
    },
  },
  {
    id: "kumala-sari",
    name: "Kumala Sari",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Kumala Sari",
    },
  },
  {
    id: "evaware",
    name: "Evaware",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Evaware",
    },
  },
  {
    id: "ai-note-taking-app",
    name: "AI note-taking app",
    subtitle: "Subtitle placeholder — product description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for AI note-taking app",
    },
  },
  {
    id: "scribe",
    name: "Scribe",
    subtitle: "Subtitle placeholder — project description to be added.",
    image: {
      src: "/images/work-placeholder.svg",
      alt: "Project image placeholder for Scribe",
    },
  },
];
