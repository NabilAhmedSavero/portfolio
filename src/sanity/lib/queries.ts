import { defineQuery } from "next-sanity";

export const SITE_CONTENT_QUERY = defineQuery(`
  *[_type == "siteContent" && _id == "siteContent"][0]{
    _id, heroDisplayName, heroRole, heroProfileImage, locationTimezoneLabel,
    about, aboutMobile, currently, freelanceStartingPrice, currentlyContactIntro, currentlyContactCta,
    contactEmail, socialLinks, footerText, useCmsProjects
  }
`);

export const EXPERIENCE_QUERY = defineQuery(`
  *[_type == "experience" && isVisible == true
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]
  | order(displayOrder asc, _id asc){
    _id, position, company, period, description, logo, monogram, displayOrder
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && isVisible == true
    && !(_id in path("drafts.**")) && !(_id in path("versions.**"))]
  | order(displayOrder asc, _id asc){
    _id, name, subtitle, coverImage, additionalImages, externalUrl, displayOrder
  }
`);
