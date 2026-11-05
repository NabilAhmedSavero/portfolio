"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { type Project, type ProjectImage, type WorkSlide } from "@/data/projects";
import { ProjectScrollIndicator, getProjectSectionId } from "./project-scroll-indicator";
import { urlFor, imageUrl } from "@/sanity/lib/images";
import type { ContentImage } from "@/sanity/types";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityProject = {
  _id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  order?: number;
  displayOrder?: number;
  images?: Array<
    ContentImage | SanityImageSource | {
      _key?: string;
      asset?: unknown;
      alt?: string;
      aspectRatio?: number;
      src?: string;
    }
  >;
  image?: ContentImage | SanityImageSource;
  coverImage?: ContentImage | SanityImageSource;
  mainImage?: ContentImage | SanityImageSource;
  additionalImages?: Array<
    ContentImage & {
      _key?: string;
      aspectRatio?: number;
    }
  >;
  externalUrl?: string;
};

export type WorkProjectImage = {
  id: string;
  src: string;
  fullSrc?: string;
  alt: string;
  aspectRatio?: number;
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

function resolveSanityAspectRatio(
  source: ContentImage | SanityImageSource | { aspectRatio?: number } | null | undefined,
): number {
  if (source && typeof source === "object") {
    if ("aspectRatio" in source && typeof source.aspectRatio === "number") {
      return source.aspectRatio;
    }
    const asset = "asset" in source ? source.asset : undefined;
    const ref = asset && typeof asset === "object" && "_ref" in asset ? asset._ref : undefined;
    if (typeof ref === "string") {
      const match = ref.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
      if (match) {
        const w = Number(match[1]);
        const h = Number(match[2]);
        if (w > 0 && h > 0) return w / h;
      }
    }
  }
  return 3 / 2;
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
  | { src?: string; alt?: string; aspectRatio?: number; _key?: string }
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
      const src = resolveSanityImageUrl(img, 2048);
      const fullSrc = resolveSanityImageUrl(img);
      if (!src) return [];
      const key =
        img && typeof img === "object" && "_key" in img && typeof img._key === "string"
          ? img._key
          : `img-${idx}`;

      return [
        {
          id: `${project._id}:${key}`,
          src,
          fullSrc,
          alt: getAltText(img, title),
          aspectRatio: resolveSanityAspectRatio(
            img as Parameters<typeof resolveSanityAspectRatio>[0],
          ),
        },
      ];
    });

    if (images.length === 0) {
      images.push({
        id: `${project._id}:placeholder`,
        src: "/images/work-placeholder.svg",
        fullSrc: "/images/work-placeholder.svg",
        alt: title,
        aspectRatio: 3 / 2,
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
    ).map((img, idx) => ({
      id: img.id || `${project.id}:${idx}`,
      src: img.src,
      fullSrc: img.fullSrc || img.src,
      alt: img.alt || project.title || project.name || "Project image",
      aspectRatio: img.aspectRatio || 3 / 2,
    })),
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
    group.images.push({
      id: item.id,
      src: item.image.src,
      fullSrc: "fullSrc" in item.image ? item.image.fullSrc : item.image.src,
      alt: item.image.alt,
      aspectRatio: item.image.aspectRatio,
    });
  }
  return Array.from(map.values());
}

type LightboxImageState = {
  id: string;
  src: string;
  fullSrc?: string;
  alt: string;
  projectTitle: string;
};

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

  const allImages = useMemo<LightboxImageState[]>(() => {
    return projectGroups.flatMap((project) =>
      project.images.map((img) => ({
        id: img.id,
        src: img.src,
        fullSrc: img.fullSrc || img.src,
        alt: img.alt || project.title,
        projectTitle: project.title,
      })),
    );
  }, [projectGroups]);

  const [lightboxImage, setLightboxImage] = useState<LightboxImageState | null>(null);

  // Lock body scroll and set data attribute to hide navs in lightbox state
  useEffect(() => {
    if (!lightboxImage) return;

    document.body.dataset.lightboxOpen = "true";
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      delete document.body.dataset.lightboxOpen;
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxImage]);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!lightboxImage || allImages.length === 0) return;
      const currentIndex = allImages.findIndex((i) => i.id === lightboxImage.id);
      const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
      setLightboxImage(allImages[prevIndex]);
    },
    [lightboxImage, allImages],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!lightboxImage || allImages.length === 0) return;
      const currentIndex = allImages.findIndex((i) => i.id === lightboxImage.id);
      const nextIndex = (currentIndex + 1) % allImages.length;
      setLightboxImage(allImages[nextIndex]);
    },
    [lightboxImage, allImages],
  );

  // Close lightbox on Escape, navigate with ArrowLeft/ArrowRight
  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxImage(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxImage, handlePrev, handleNext]);

  const handleImageClick = (
    e: MouseEvent<HTMLElement>,
    image: WorkProjectImage,
    project: WorkProjectGroup,
  ) => {
    if (!project.externalUrl) {
      e.preventDefault();
      setLightboxImage({
        id: image.id,
        src: image.src,
        fullSrc: image.fullSrc || image.src,
        alt: image.alt || project.title,
        projectTitle: project.title,
      });
    }
  };

  const currentLightboxIndex = lightboxImage
    ? Math.max(
        0,
        allImages.findIndex((i) => i.id === lightboxImage.id),
      )
    : 0;

  return (
    <section aria-label="Work Projects" className="w-full m-0 p-0">
      <ProjectScrollIndicator projects={projectGroups} />

      <div className="w-full max-w-[682px] mx-auto m-0 p-0 flex flex-col">
        {projectGroups.map((project, projectIndex) => {
          const isLastProject = projectIndex === projectGroups.length - 1;
          const sectionId = getProjectSectionId(project.id);

          return (
            <div
              key={project.id}
              id={sectionId}
              className="w-full mt-0 scroll-mt-8 sm:scroll-mt-12 md:scroll-mt-16"
            >
              <article className="w-full mt-0 flex flex-col items-center">
                {/* 1. Header & Subheader Group (Centered above the images) */}
                <header className="mt-0 flex flex-col items-center text-center gap-[4px] mb-[20px]">
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
                    const Tag = project.externalUrl ? "a" : "div";
                    const linkProps = project.externalUrl
                      ? {
                          href: project.externalUrl,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {
                          role: "button",
                          tabIndex: 0,
                          onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleImageClick(
                                e as unknown as MouseEvent<HTMLElement>,
                                image,
                                project,
                              );
                            }
                          },
                        };

                    return (
                      <Tag
                        key={image.id || `${project.id}-${imgIndex}`}
                        {...linkProps}
                        onClick={(e) =>
                          handleImageClick(
                            e as unknown as MouseEvent<HTMLElement>,
                            image,
                            project,
                          )
                        }
                        className="group/image block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded-[8px]"
                        aria-label={`View ${image.alt || project.title}`}
                      >
                        {/* Image Container: Strict 3:2 aspect ratio, edge-to-edge cover, 8px radius */}
                        <div className="w-full aspect-[3/2] relative overflow-hidden rounded-[8px] bg-[#f5f5f7] flex items-center justify-center border border-[#232323]/10 cursor-pointer">
                          <Image
                            src={image.src}
                            alt={image.alt || project.title}
                            width={1800}
                            height={1200}
                            unoptimized={true}
                            priority={projectIndex === 0 && imgIndex === 0}
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 682px"
                            className="w-full h-full object-cover block cursor-pointer"
                          />
                        </div>
                      </Tag>
                    );
                  })}
                </div>
              </article>

              {/* 3. Horizontal Divider Below Bottom-Most Image */}
              {!isLastProject && (
                <hr className="w-full h-[1px] border-0 bg-[hsl(0,0%,90%)] mt-[40px] mb-[40px]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 h-[100dvh] z-[9999] flex flex-col items-center justify-end sm:justify-evenly gap-[5vh] sm:gap-0 px-4 pb-[22dvh] sm:pb-0 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-200 select-none"
            onClick={() => setLightboxImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Full preview of ${lightboxImage.projectTitle}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.fullSrc || lightboxImage.src}
              alt={lightboxImage.alt}
              className="z-10 max-h-[65dvh] sm:max-h-[87vh] max-w-[96vw] sm:max-w-[98vw] w-auto h-auto object-contain rounded-[8px] pointer-events-auto shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Bottom Controls */}
            <nav
              className="flex items-center justify-center gap-3 sm:gap-4 z-20 shrink-0 h-[32px]"
              onClick={(e) => e.stopPropagation()}
              aria-label="Modal image navigation"
            >
              <button
                type="button"
                onClick={handlePrev}
                className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
                aria-label="Previous image"
              >
                <svg
                  className="w-[16px] h-[16px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <span
                className="font-sans text-[13px] sm:text-[14px] text-white/90 select-none tracking-wider tabular-nums flex items-center"
                aria-live="polite"
                aria-atomic="true"
              >
                <span>{currentLightboxIndex + 1}</span>
                <span className="text-white/40 mx-1.5 font-sans font-light select-none">/</span>
                <span>{allImages.length}</span>
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
                aria-label="Next image"
              >
                <svg
                  className="w-[16px] h-[16px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </nav>
          </div>,
          document.body,
        )}
    </section>
  );
}
