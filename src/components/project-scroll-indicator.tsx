"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function getProjectSectionId(id: string): string {
  const clean = id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return clean.startsWith("project-") ? clean : `project-${clean}`;
}

export type IndicatorProject = {
  id: string;
  title: string;
};

type ProjectScrollIndicatorProps = {
  projects: readonly IndicatorProject[];
};

export function ProjectScrollIndicator({ projects }: ProjectScrollIndicatorProps) {
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lockedLabelId, setLockedLabelId] = useState<string | null>(null);
  const [isClickSuppressed, setIsClickSuppressed] = useState<boolean>(false);

  const isScrollingRef = useRef<boolean>(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derived active item
  const activeId =
    currentId && projects.some((p) => p.id === currentId)
      ? currentId
      : projects[0]?.id || "";

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  // Scroll Spy: Tracks active project section in viewport
  useEffect(() => {
    if (projects.length === 0) return;

    const handleScroll = () => {
      // Don't override during programmatic click-scroll
      if (isScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // Handle extreme top
      if (scrollY < 80) {
        setCurrentId(projects[0].id);
        return;
      }

      // Handle extreme bottom (page end)
      if (windowHeight + scrollY >= scrollHeight - 60) {
        setCurrentId(projects[projects.length - 1].id);
        return;
      }

      // Threshold at 35% down viewport
      const viewportThreshold = scrollY + windowHeight * 0.35;
      let currentActiveId = projects[0].id;

      for (const project of projects) {
        const el = document.getElementById(getProjectSectionId(project.id));
        if (!el) continue;
        const top = el.offsetTop;
        if (viewportThreshold >= top) {
          currentActiveId = project.id;
        } else {
          break;
        }
      }

      setCurrentId(currentActiveId);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [projects]);

  const handleProjectClick = useCallback((projectId: string) => {
    const sectionId = getProjectSectionId(projectId);
    const element = document.getElementById(sectionId);
    if (!element) return;

    isScrollingRef.current = true;
    setCurrentId(projectId);
    setLockedLabelId(projectId);
    setIsClickSuppressed(true);

    element.scrollIntoView({ behavior: "smooth", block: "start" });

    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
    }

    // Keep label visible for ~800ms during scroll, then return to State 1
    lockTimeoutRef.current = setTimeout(() => {
      setLockedLabelId(null);
      isScrollingRef.current = false;
    }, 800);
  }, []);

  if (projects.length === 0) return null;

  return (
    <aside
      aria-label="Project indicator navigation"
      className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-start gap-[8px] select-none"
    >
      {projects.map((project) => {
        const isActive = activeId === project.id;
        const isHovered = hoveredId === project.id;
        const isLocked = lockedLabelId === project.id;
        const showLabel = isLocked || (isHovered && !isClickSuppressed);

        return (
          <button
            type="button"
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => {
              setHoveredId(null);
              setIsClickSuppressed(false);
            }}
            onMouseMove={() => {
              if (isClickSuppressed) {
                setIsClickSuppressed(false);
              }
            }}
            aria-label={`Scroll to ${project.title}`}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center cursor-pointer py-1 -my-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded"
          >
            {/* Fixed 32px bar container ensures label start position aligns across all rows */}
            <div className="w-[32px] flex items-center justify-start">
              <span
                className={`h-[4px] rounded-full transition-all duration-300 ease-out ${
                  isActive
                    ? "w-[32px] bg-[#1C1C1C]"
                    : isHovered
                    ? "w-[32px] bg-[#737373]"
                    : "w-[24px] bg-[#E5E5E5]"
                }`}
              />
            </div>

            {/* Project title label with Home page reveal easing/blur */}
            {showLabel && (
              <span className="project-indicator-label-enter ml-3 text-[14px] leading-[20px] font-normal text-[#1C1C1C] whitespace-nowrap pointer-events-none select-none">
                {project.title}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
