import "server-only";

import { cache } from "react";
import { experienceFallback, homeFallback, type HomeExperience } from "@/data/home";
import type { EXPERIENCE_QUERY_RESULT } from "../types";
import { fetchPublished } from "./client";
import { getSiteContent } from "./content";
import { imageUrl } from "./images";
import { safeHref } from "./links";
import { EXPERIENCE_QUERY } from "./queries";

export const getHomeContent = cache(async () => {
  const site = await getSiteContent();
  const profileUrl = imageUrl(site?.heroProfileImage);
  const about = site?.about?.length ? site.about : homeFallback.about;

  return {
    heroDisplayName: site?.heroDisplayName?.trim() || homeFallback.heroDisplayName,
    heroRole: site?.heroRole?.trim() || homeFallback.heroRole,
    heroProfileImage: profileUrl ? {
      src: profileUrl,
      alt: site?.heroProfileImage?.alt || homeFallback.heroProfileImage.alt,
    } : homeFallback.heroProfileImage,
    locationTimezoneLabel: site?.locationTimezoneLabel?.trim() || homeFallback.locationTimezoneLabel,
    about,
    // Existing CMS About copy also works on smaller screens unless an override is supplied.
    aboutMobile: site?.aboutMobile?.length ? site.aboutMobile : site?.about?.length ? about : homeFallback.aboutMobile,
    currently: site?.currently?.length ? site.currently : homeFallback.currently,
    freelanceStartingPrice: site?.freelanceStartingPrice?.trim() || homeFallback.freelanceStartingPrice,
    currentlyContactIntro: site?.currentlyContactIntro ?? homeFallback.currentlyContactIntro,
    currentlyContactCta: {
      text: site?.currentlyContactCta?.text?.trim() || homeFallback.currentlyContactCta.text,
      href: site?.currentlyContactCta ? safeHref(site.currentlyContactCta.href) : homeFallback.currentlyContactCta.href,
    },
    contactEmail: site?.contactEmail?.trim() || homeFallback.contactEmail,
    socialLinks: (site?.socialLinks ?? homeFallback.socialLinks).flatMap((link) => {
      const href = safeHref(link.href);
      return href && link.label?.trim() ? [{
        id: link._key, label: link.label, displayText: link.displayText?.trim() || link.label, href,
      }] : [];
    }),
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
    }];
  });
});
