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

  return rawAbout.map((block, index) => {
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
}

function normalizeCurrentlyCopy(
  rawCurrently: RichText | null | undefined,
  freelanceStartingPrice: string | null | undefined,
  currentlyContactIntro: string | null | undefined,
  currentlyContactCta: { text?: string; href?: string; hoverColor?: { _type: "color"; hex?: string } } | null | undefined,
): RichText {
  if (!rawCurrently?.length) return homeFallback.currently;
  if (rawCurrently.length >= 2) return rawCurrently;

  const freelanceBlock: RichText[number] = {
    _type: "block",
    _key: "freelance",
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: "freelance-text",
        text: freelanceStartingPrice?.trim() || homeFallback.freelanceStartingPrice,
        marks: [],
      },
    ],
  };

  const ctaHref = currentlyContactCta?.href ? safeHref(currentlyContactCta.href) : null;
  const ctaText = currentlyContactCta?.text?.trim() || homeFallback.currentlyContactCta.text;
  const introText = (currentlyContactIntro ?? homeFallback.currentlyContactIntro).trim();

  const collabBlock: RichText[number] = {
    _type: "block",
    _key: "collaborations",
    style: "normal",
    markDefs: [
      { _type: "link", _key: "faction-link", href: "https://faction.ai" },
      { _type: "link", _key: "serving-hours-link", href: "https://servinghours.com" },
      { _type: "link", _key: "plied-link", href: "https://plied.ai" },
      { _type: "link", _key: "cara-florist-link", href: "https://caraflorist.com/" },
      {
        _type: "link",
        _key: "cta-link",
        href: ctaHref || homeFallback.currentlyContactCta.href,
        ...(currentlyContactCta?.hoverColor ? { hoverColor: currentlyContactCta.hoverColor } : {}),
      },
    ],
    children: [
      { _type: "span", _key: "collab-1", text: "Previously collaborated with ", marks: [] },
      { _type: "span", _key: "collab-faction", text: "Faction", marks: ["faction-link"] },
      { _type: "span", _key: "collab-2", text: ", ", marks: [] },
      { _type: "span", _key: "collab-sh", text: "Serving Hours", marks: ["serving-hours-link"] },
      { _type: "span", _key: "collab-3", text: ", ", marks: [] },
      { _type: "span", _key: "collab-plied", text: "Plied", marks: ["plied-link"] },
      { _type: "span", _key: "collab-4", text: ", ", marks: [] },
      { _type: "span", _key: "collab-cara", text: "Cara Florist", marks: ["cara-florist-link"] },
      { _type: "span", _key: "collab-5", text: `, and others. ${introText} `, marks: [] },
      { _type: "span", _key: "collab-cta", text: ctaText, marks: ["cta-link"] },
      { _type: "span", _key: "collab-6", text: ".", marks: [] },
    ],
  };

  return [rawCurrently[0], freelanceBlock, collabBlock];
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
    heroProfileImage: profileUrl ? {
      src: profileUrl,
      alt: site?.heroProfileImage?.alt || homeFallback.heroProfileImage.alt,
    } : homeFallback.heroProfileImage,
    heroProfileImageRaw: rawAvatar,
    locationTimezoneLabel: site?.locationTimezoneLabel?.trim() || homeFallback.locationTimezoneLabel,
    cityHoverColor: site?.cityHoverColor?.hex || homeFallback.cityHoverColor,
    about,
    // Existing CMS About copy also works on smaller screens unless an override is supplied.
    aboutMobile: site?.aboutMobile?.length ? normalizeAboutCopy(site.aboutMobile) : about,
    currently: normalizeCurrentlyCopy(
      site?.currently,
      site?.freelanceStartingPrice,
      site?.currentlyContactIntro,
      site?.currentlyContactCta,
    ),
    freelanceStartingPrice: site?.freelanceStartingPrice?.trim() || homeFallback.freelanceStartingPrice,
    currentlyContactIntro: site?.currentlyContactIntro ?? homeFallback.currentlyContactIntro,
    currentlyContactCta: {
      text: site?.currentlyContactCta?.text?.trim() || homeFallback.currentlyContactCta.text,
      href: site?.currentlyContactCta ? safeHref(site.currentlyContactCta.href) : homeFallback.currentlyContactCta.href,
      hoverColor: site?.currentlyContactCta?.hoverColor?.hex,
    },
    contactsCopy: site?.contactsCopy?.length ? site.contactsCopy : homeFallback.contactsCopy,
    contactEmail: site?.contactEmail?.trim() || homeFallback.contactEmail,
    socialLinks: (() => {
      const rawLinks = site?.socialLinks?.length ? site.socialLinks : homeFallback.socialLinks;
      const links = rawLinks.flatMap((link) => {
        const href = safeHref(link.href);
        return href && link.label?.trim() ? [{
          id: link._key,
          label: link.label,
          displayText: link.displayText?.trim() || link.label,
          href,
          hoverColor: "hoverColor" in link ? link.hoverColor?.hex : undefined,
        }] : [];
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
    return [{
      id: record._id,
      position: record.position,
      company: record.company || "",
      period: record.period || "",
      description: record.description || "",
      ...(logoUrl ? { logo: { src: logoUrl, alt: record.logo?.alt || record.company || "" } } : {}),
      ...(record.monogram ? { monogram: record.monogram } : {}),
    }];
  });
});
