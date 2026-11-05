"use client";

import Image from "next/image";
import { useMemo } from "react";
import { type Project, type ProjectImage, type WorkSlide } from "@/data/projects";
import { ProjectScrollIndicator, getProjectSectionId } from "./project-scroll-indicator";
import { urlFor, imageUrl } from "@/sanity/lib/images";
import type { ContentImage } from "@/sanity/types";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityImageDimensions = {
  width?: number;
  height?: number;
  aspectRatio?: number;
};

export type SanityProject = {
  _id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  order?: number;
  displayOrder?: number;
  images?: Array<
    | ContentImage
    | SanityImageSource
    | {
        _key?: string;
        asset?: unknown;
        alt?: string;
        aspectRatio?: number;
        dimensions?: SanityImageDimensions | null;
        src?: string;
      }
  >;
  image?: (ContentImage & { dimensions?: SanityImageDimensions | null }) | SanityImageSource;
  coverImage?: (ContentImage & { dimensions?: SanityImageDimensions | null }) | SanityImageSource;
  mainImage?: (ContentImage & { dimensions?: SanityImageDimensions | null }) | SanityImageSource;
  additionalImages?: Array<
    ContentImage & {
      _key?: string;
      aspectRatio?: number;
      dimensions?: SanityImageDimensions | null;
    }
  >;
  externalUrl?: string;
};

export type WorkProjectImage = {
  id: string;
  src: string;
  fullSrc?: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
};

export type WorkProjectGroup = {
  id: string;
  title: string;
  subtitle: string;
  order?: number;
  externalUrl?: string;
  images: WorkProjectImage[];
};

export type WorkGalleryItem = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: {
    src: string;
    fullSrc?: string;
    alt: string;
    aspectRatio?: number;
  };
};

export type WorkGalleryProps = {
  projects?: readonly SanityProject[];
  items?: readonly (WorkSlide | WorkGalleryItem)[];
  fallbackProjects?: readonly Project[];
};

function resolveSanityImageUrl(
  source: SanityImageSource | ContentImage | { src?: string; alt?: string } | string | null | undefined,
  width?: number,
): string {
  if (!source) return "/images/work-placeholder.svg";
  if (typeof source === "string") return source;
  if (typeof source === "object" && "src" in source && typeof source.src === "string") {
    return source.src;
  }

  try {
    const builder = urlFor(source as SanityImageSource);
    if (builder) {
      if (width) {
        return builder.width(width).fit("max").quality(100).auto("format").url();
      }
      return builder.auto("format").quality(100).url();
    }
  } catch {
    // fallback below
  }

  return imageUrl(source as SanityImageSource) || "/images/work-placeholder.svg";
}

function resolveSanityDimensions(
  source:
    | ContentImage
    | SanityImageSource
    | {
        aspectRatio?: number;
        width?: number;
        height?: number;
        dimensions?: SanityImageDimensions | null;
        asset?: {
          _ref?: string;
          metadata?: { dimensions?: SanityImageDimensions | null } | null;
        } | null;
      }
    | null
    | undefined,
): { width: number; height: number; aspectRatio: number } {
  if (source && typeof source === "object") {
    const dims =
      ("dimensions" in source && source.dimensions ? source.dimensions : null) ||
      ("asset" in source &&
      source.asset &&
      typeof source.asset === "object" &&
      "metadata" in source.asset &&
      source.asset.metadata &&
      typeof source.asset.metadata === "object" &&
      "dimensions" in source.asset.metadata
        ? source.asset.metadata.dimensions
        : null);

    if (dims && typeof dims === "object") {
      const w = typeof dims.width === "number" && dims.width > 0 ? dims.width : undefined;
      const h = typeof dims.height === "number" && dims.height > 0 ? dims.height : undefined;
      const ar =
        typeof dims.aspectRatio === "number" && dims.aspectRatio > 0
          ? dims.aspectRatio
          : w && h
            ? w / h
            : undefined;
      if (w && h && ar) {
        return { width: w, height: h, aspectRatio: ar };
      }
      if (ar) {
        return { width: Math.round(1024 * ar), height: 1024, aspectRatio: ar };
      }
    }

    const asset = "asset" in source ? source.asset : undefined;
    const ref =
      asset && typeof asset === "object" && "_ref" in asset ? asset._ref : undefined;
    if (typeof ref === "string") {
      const match = ref.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
      if (match) {
        const w = Number(match[1]);
        const h = Number(match[2]);
        if (w > 0 && h > 0) {
          return { width: w, height: h, aspectRatio: w / h };
        }
      }
    }

    if ("aspectRatio" in source && typeof source.aspectRatio === "number" && source.aspectRatio > 0) {
      const ar = source.aspectRatio;
      const w =
        "width" in source && typeof source.width === "number" && source.width > 0
          ? source.width
          : Math.round(1024 * ar);
      const h =
        "height" in source && typeof source.height === "number" && source.height > 0
          ? source.height
          : 1024;
      return { width: w, height: h, aspectRatio: ar };
    }
  }

  return { width: 1440, height: 1024, aspectRatio: 1440 / 1024 };
}

function getAltText(source: unknown, fallback: string): string {
  if (source && typeof source === "object" && "alt" in source && typeof source.alt === "string") {
    return source.alt;
  }
  return fallback;
}

type RawSanityImage =
  | SanityImageSource
  | ContentImage
  | {
      src?: string;
      alt?: string;
      aspectRatio?: number;
      dimensions?: SanityImageDimensions | null;
      _key?: string;
    }
  | string
  | null
  | undefined;

function createProjectGroupsFromSanity(projects: readonly SanityProject[]): WorkProjectGroup[] {
  return projects.flatMap((project) => {
    const title = project.title || project.name;
    if (!title?.trim()) return [];
    const subtitle = project.subtitle || "";

    // Normalize images array (support images, image, coverImage, additionalImages)
    let rawImages: RawSanityImage[] = [];
    if (Array.isArray(project.images) && project.images.length > 0) {
      rawImages = project.images as RawSanityImage[];
    } else if (project.image) {
      rawImages = [project.image];
    } else {
      if (project.coverImage || project.mainImage) {
        rawImages.push(project.coverImage || project.mainImage);
      }
      if (Array.isArray(project.additionalImages)) {
        rawImages.push(...project.additionalImages);
      }
    }

    const images: WorkProjectImage[] = rawImages.flatMap((img, idx) => {
      const src = resolveSanityImageUrl(img, 2400);
      const fullSrc = resolveSanityImageUrl(img);
      if (!src) return [];
      const key =
        img && typeof img === "object" && "_key" in img && typeof img._key === "string"
          ? img._key
          : `img-${idx}`;
      const dimensions = resolveSanityDimensions(
        img as Parameters<typeof resolveSanityDimensions>[0],
      );

      return [
        {
          id: `${project._id}:${key}`,
          src,
          fullSrc,
          alt: getAltText(img, title),
          width: dimensions.width,
          height: dimensions.height,
          aspectRatio: dimensions.aspectRatio,
        },
      ];
    });

    if (images.length === 0) {
      images.push({
        id: `${project._id}:placeholder`,
        src: "/images/work-placeholder.svg",
        fullSrc: "/images/work-placeholder.svg",
        alt: title,
        width: 1440,
        height: 1024,
        aspectRatio: 1440 / 1024,
      });
    }

    return [
      {
        id: project._id,
        title,
        subtitle,
        order: project.order ?? project.displayOrder ?? 0,
        externalUrl: project.externalUrl,
        images,
      },
    ];
  });
}

function createProjectGroupsFromFallback(fallbacks: readonly Project[]): WorkProjectGroup[] {
  return fallbacks.map((project) => ({
    id: project.id,
    title: project.title || project.name || "Untitled",
    subtitle: project.subtitle,
    order: project.order,
    externalUrl: project.externalUrl,
    images: (
      project.images && project.images.length > 0
        ? project.images
        : [project.image, ...(project.additionalImages ?? [])].filter(
            Boolean,
          ) as readonly ProjectImage[]
    ).map((img, idx) => {
      const aspectRatio = img.aspectRatio || 1440 / 1024;
      return {
        id: img.id || `${project.id}:${idx}`,
        src: img.src,
        fullSrc: img.fullSrc || img.src,
        alt: img.alt || project.title || project.name || "Project image",
        width: Math.round(1024 * aspectRatio),
        height: 1024,
        aspectRatio,
      };
    }),
  }));
}

function groupLegacyItems(items: readonly (WorkSlide | WorkGalleryItem)[]): WorkProjectGroup[] {
  const map = new Map<string, WorkProjectGroup>();
  for (const item of items) {
    const key = item.name || "Untitled";
    if (!map.has(key)) {
      map.set(key, {
        id: item.id.split(":")[0] || key,
        title: item.name,
        subtitle: item.subtitle,
        externalUrl: item.externalUrl,
        images: [],
      });
    }
    const group = map.get(key)!;
    const aspectRatio = item.image.aspectRatio || 1440 / 1024;
    group.images.push({
      id: item.id,
      src: item.image.src,
      fullSrc: "fullSrc" in item.image ? item.image.fullSrc : item.image.src,
      alt: item.image.alt,
      width: Math.round(1024 * aspectRatio),
      height: 1024,
      aspectRatio,
    });
  }
  return Array.from(map.values());
}

export function WorkGallery({
  projects,
  items: directItems,
  fallbackProjects,
}: WorkGalleryProps) {
  const projectGroups = useMemo<WorkProjectGroup[]>(() => {
    if (projects && projects.length > 0) {
      return createProjectGroupsFromSanity(projects);
    }
    if (directItems && directItems.length > 0) {
      return groupLegacyItems(directItems);
    }
    if (fallbackProjects && fallbackProjects.length > 0) {
      return createProjectGroupsFromFallback(fallbackProjects);
    }
    return [];
  }, [projects, directItems, fallbackProjects]);

  return (
    <section aria-label="Work Projects" className="w-full m-0 p-0">
      <ProjectScrollIndicator projects={projectGroups} />

      <div className="max-w-[880px] w-full mx-auto p-0 flex flex-col">
        {projectGroups.map((project, projectIndex) => {
          const sectionId = getProjectSectionId(project.id);

          return (
            <div
              key={project.id}
              id={sectionId}
              className={`w-full scroll-mt-8 sm:scroll-mt-12 md:scroll-mt-16 ${
                projectIndex > 0 ? "mt-[40px]" : "mt-0"
              }`}
            >
              <article className="w-full mt-0 flex flex-col items-center">
                {/* 1. Header & Subheader Group (Centered above the images) */}
                <header className="mt-0 flex flex-col items-center text-center gap-[4px] mb-[40px]">
                  <h2 className="m-0 text-[15px] leading-[20px] font-medium text-[#1c1c1c]">
                    {project.title}
                  </h2>
                  {project.subtitle && (
                    <p className="m-0 text-[14px] leading-[20px] font-normal text-[#737373]">
                      {project.subtitle}
                    </p>
                  )}
                </header>

                {/* 2. Project Images Stack */}
                <div className="flex flex-col gap-[20px] w-full">
                  {project.images.map((image, imgIndex) => {
                    const imageElement = (
                      <div className="max-w-[880px] w-full mx-auto rounded-[12px] md:rounded-[16px] overflow-hidden ring-1 ring-black/[0.06]">
                        <Image
                          src={image.src}
                          alt={image.alt || project.title}
                          width={image.width}
                          height={image.height}
                          unoptimized={true}
                          priority={projectIndex === 0 && imgIndex === 0}
                          quality={100}
                          sizes="(max-width: 1024px) 100vw, 880px"
                          className="w-full h-auto block"
                          style={{ aspectRatio: image.aspectRatio }}
                        />
                      </div>
                    );

                    return project.externalUrl ? (
                      <a
                        key={image.id || `${project.id}-${imgIndex}`}
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/image block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded-[12px] md:rounded-[16px]"
                        aria-label={`View ${image.alt || project.title}`}
                      >
                        {imageElement}
                      </a>
                    ) : (
                      <div
                        key={image.id || `${project.id}-${imgIndex}`}
                        className="block w-full rounded-[12px] md:rounded-[16px]"
                      >
                        {imageElement}
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
