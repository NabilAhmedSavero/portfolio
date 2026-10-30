import "server-only";

import { cache } from "react";
import { experienceFallback, homeFallback, type HomeExperience } from "@/data/home";
import type { EXPERIENCE_QUERY_RESULT, RichText } from "../types";
import { fetchPublished } from "./client";
import { getSiteContent } from "./content";
import { imageUrl, urlFor } from "./images";
import { safeHref } from "./links";
import { EXPERIENCE_QUERY } from "./queries";

function normalizeAboutCopy(rawAbout: RichText | null | undefined): RichText {
  if (!rawAbout?.length) return homeFallback.about;

  // Filter out any computer science background block (legacy 3rd block in old about)
  const filtered = rawAbout.filter((block) => {
    const text = block.children?.map((c) => c.text ?? "").join("") ?? "";
    return !text.toLowerCase().includes("computer science background");
  });

  const normalized = filtered.map((block, index) => {
    if (index === 0 && block.children?.length) {
      const fullText = block.children.map((c) => c.text ?? "").join("");
      if (!fullText.includes("Balikpapan")) {
        return {
          ...block,
          children: block.children.map((span) => {
            if (typeof span.text === "string" && /Hi!\s*I[’']m Nabil Ahmed Savero\./i.test(span.text)) {
              return {
                ...span,
                text: span.text.replace(
                  /Hi!\s*I[’']m Nabil Ahmed Savero\./i,
                  "Hi! I'm Nabil Ahmed Savero, based in Balikpapan.",
                ),
              };
            }
            return span;
          }),
        };
      }
      // Also normalize curly apostrophe to straight apostrophe for clean typography
      return {
        ...block,
        children: block.children.map((span) => ({
          ...span,
          text: span.text?.replace(/I’m/g, "I'm"),
        })),
      };
    }
    return block;
  });

  // Check if inline contacts paragraph exists
  const hasInlineContacts = normalized.some((block) => {
    const text = block.children?.map((c) => c.text ?? "").join("") ?? "";
    return text.includes("reach out via email") || text.includes("saverovkn@gmail.com");
  });

  if (!hasInlineContacts) {
    normalized.push(homeFallback.about[2]);
  }

  return normalized;
}

function normalizeExperienceCopy(rawExperience: RichText | null | undefined): RichText {
  if (rawExperience?.length) return rawExperience;
  return homeFallback.experience;
}

function normalizeCurrentlyCopy(rawCurrently: RichText | null | undefined): RichText {
  if (!rawCurrently?.length) return homeFallback.currently;

  // Filter out any legacy collaboration block that belonged to previous Currently section
  const cleaned = rawCurrently.filter((block) => {
    const text = block.children?.map((c) => c.text ?? "").join("") ?? "";
    return !text.toLowerCase().includes("previously collaborated with");
  });

  if (!cleaned.length) return homeFallback.currently;
  return cleaned;
}

export const getHomeContent = cache(async () => {
  const site = await getSiteContent();
  const rawAvatar = site?.heroProfileImage;
  const croppedProfileUrl = rawAvatar?.asset
    ? urlFor(rawAvatar)?.width(512).height(512).quality(100).fit("crop").url()
    : null;
  const profileUrl = croppedProfileUrl || imageUrl(rawAvatar);
  const about = normalizeAboutCopy(site?.about);

  return {
    heroDisplayName: site?.heroDisplayName?.trim() || homeFallback.heroDisplayName,
    roleSubtitle: site?.roleSubtitle?.trim() || homeFallback.roleSubtitle,
    heroRole: site?.heroRole?.trim() || homeFallback.heroRole,
    heroProfileImage: profileUrl
      ? {
          src: profileUrl,
          alt: site?.heroProfileImage?.alt || homeFallback.heroProfileImage.alt,
        }
      : homeFallback.heroProfileImage,
    heroProfileImageRaw: rawAvatar,
    locationTimezoneLabel: site?.locationTimezoneLabel?.trim() || homeFallback.locationTimezoneLabel,
    cityHoverColor: site?.cityHoverColor?.hex || homeFallback.cityHoverColor,
    about,
    // Existing CMS About copy also works on smaller screens unless an override is supplied.
    aboutMobile: site?.aboutMobile?.length ? normalizeAboutCopy(site.aboutMobile) : about,
    experience: normalizeExperienceCopy(site?.experience),
    currently: normalizeCurrentlyCopy(site?.currently),
    // Backward compatibility for legacy templates
    freelanceStartingPrice: "",
    currentlyContactIntro: "",
    currentlyContactCta: {
      text: "",
      href: null as string | null,
      hoverColor: undefined as string | undefined,
    },
    contactEmail: site?.contactEmail?.trim() || homeFallback.contactEmail,
    socialLinks: (() => {
      const rawLinks = site?.socialLinks?.length ? site.socialLinks : homeFallback.socialLinks;
      const links = rawLinks.flatMap((link) => {
        const href = safeHref(link.href);
        return href && link.label?.trim()
          ? [
              {
                id: link._key,
                label: link.label,
                displayText: link.displayText?.trim() || link.label,
                href,
                hoverColor: "hoverColor" in link ? link.hoverColor?.hex : undefined,
              },
            ]
          : [];
      });
      if (!links.some((l) => l.label.toLowerCase() === "linkedin")) {
        links.push({
          id: "linkedin",
          label: "LinkedIn",
          displayText: "Nabil Savero",
          href: "https://www.linkedin.com/in/nabil-saveroo/",
          hoverColor: undefined,
        });
      }
      return links;
    })(),
    footerText: site?.footerText?.trim() || homeFallback.footerText,
  };
});

export const getHomeExperiences = cache(async (): Promise<readonly HomeExperience[]> => {
  const records = await fetchPublished<EXPERIENCE_QUERY_RESULT>(EXPERIENCE_QUERY);
  if (records === null) return experienceFallback;

  // Keep the reference content during initial connection to an empty dataset.
  // Publishing Home marks the migration; empty collections then respect removals.
  if (records.length === 0 && !(await getSiteContent())) return experienceFallback;

  // A successful empty collection respects the editor's unpublish/delete decisions.
  return records.flatMap((record) => {
    if (!record.position?.trim()) return [];
    const logoUrl = imageUrl(record.logo);
    return [
      {
        id: record._id,
        position: record.position,
        company: record.company || "",
        period: record.period || "",
        description: record.description || "",
        ...(logoUrl ? { logo: { src: logoUrl, alt: record.logo?.alt || record.company || "" } } : {}),
        ...(record.monogram ? { monogram: record.monogram } : {}),
      },
    ];
  });
});
