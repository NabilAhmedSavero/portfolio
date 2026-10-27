export type ProjectImage = {
  id: string;
  src: string;
  fullSrc?: string;
  alt: string;
  aspectRatio?: number;
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  order?: number;
  externalUrl?: string;
  images: readonly ProjectImage[];
  // Legacy aliases for backward compatibility
  name?: string;
  image?: ProjectImage;
  additionalImages?: readonly ProjectImage[];
};

export type WorkSlide = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: ProjectImage;
};

/** Flattened collection of images across all projects for lightbox or legacy slide consumers. */
export function createWorkSlides(items: readonly Project[]): WorkSlide[] {
  return items.flatMap((project) => {
    const list =
      project.images && project.images.length > 0
        ? project.images
        : [project.image, ...(project.additionalImages ?? [])].filter(
            Boolean,
          ) as readonly ProjectImage[];

    return list.map((image, idx) => ({
      id: `${project.id}:${image.id || idx}`,
      name: project.title || project.name || "Untitled",
      subtitle: project.subtitle,
      ...(project.externalUrl ? { externalUrl: project.externalUrl } : {}),
      image: {
        id: image.id,
        src: image.src,
        fullSrc: image.fullSrc || image.src,
        alt: image.alt,
        aspectRatio: image.aspectRatio,
      },
    }));
  });
}

// Grouped works fallback data (Faction, Plied, Cara Florist, Kumala Sari, Evaware)
export const projects: readonly Project[] = [
  {
    id: "faction",
    title: "Faction",
    name: "Faction",
    subtitle: "AI-integrated enterprise management system",
    order: 1,
    images: [
      {
        id: "faction-1",
        src: "/images/work-placeholder.svg",
        alt: "Faction enterprise dashboard",
        aspectRatio: 1.6,
      },
      {
        id: "faction-2",
        src: "/images/work-placeholder.svg",
        alt: "Faction workspace interaction flow",
        aspectRatio: 1.6,
      },
    ],
    get image() {
      return this.images[0];
    },
    get additionalImages() {
      return this.images.slice(1);
    },
  },
  {
    id: "plied",
    title: "Plied",
    name: "Plied",
    subtitle: "Curated design inspiration and digital craft library",
    order: 2,
    images: [
      {
        id: "plied-1",
        src: "/images/work-placeholder.svg",
        alt: "Plied design archive interface",
        aspectRatio: 1.6,
      },
      {
        id: "plied-2",
        src: "/images/work-placeholder.svg",
        alt: "Plied interactive artifact viewer",
        aspectRatio: 1.6,
      },
    ],
    get image() {
      return this.images[0];
    },
    get additionalImages() {
      return this.images.slice(1);
    },
  },
  {
    id: "cara-florist",
    title: "Cara Florist",
    name: "Cara Florist",
    subtitle: "E-commerce and brand experience for modern floral studio",
    order: 3,
    images: [
      {
        id: "cara-1",
        src: "/images/work-placeholder.svg",
        alt: "Cara Florist online store homepage",
        aspectRatio: 1.6,
      },
      {
        id: "cara-2",
        src: "/images/work-placeholder.svg",
        alt: "Cara Florist product customizer",
        aspectRatio: 1.6,
      },
    ],
    get image() {
      return this.images[0];
    },
    get additionalImages() {
      return this.images.slice(1);
    },
  },
  {
    id: "kumala-sari",
    title: "Kumala Sari",
    name: "Kumala Sari",
    subtitle: "Hospitality and lifestyle brand digital presence",
    order: 4,
    images: [
      {
        id: "kumala-1",
        src: "/images/work-placeholder.svg",
        alt: "Kumala Sari resort overview",
        aspectRatio: 1.6,
      },
    ],
    get image() {
      return this.images[0];
    },
    get additionalImages() {
      return this.images.slice(1);
    },
  },
  {
    id: "evaware",
    title: "Evaware",
    name: "Evaware",
    subtitle: "Intelligent analytics and data exploration workspace",
    order: 5,
    images: [
      {
        id: "evaware-1",
        src: "/images/work-placeholder.svg",
        alt: "Evaware visual data canvas",
        aspectRatio: 1.6,
      },
    ],
    get image() {
      return this.images[0];
    },
    get additionalImages() {
      return this.images.slice(1);
    },
  },
];
