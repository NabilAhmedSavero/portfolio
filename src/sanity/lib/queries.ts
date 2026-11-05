import { defineQuery } from "next-sanity";

export const SITE_CONTENT_QUERY = defineQuery(`
  *[_type == "siteContent" && _id == "siteContent"][0]{
    _id, heroDisplayName, roleSubtitle, heroRole, heroProfileImage { asset, crop, hotspot, alt }, locationTimezoneLabel,
    cityHoverColor, about, aboutMobile, experience, currently,
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
  | order(coalesce(order, displayOrder, 0) asc, _id asc){
    _id,
    "title": coalesce(title, name, ""),
    subtitle,
    "order": coalesce(order, displayOrder, 0),
    "images": select(
      defined(images) && count(images) > 0 => images[]{
        ...,
        "dimensions": asset->metadata.dimensions
      },
      defined(image) => [image{
        ...,
        "dimensions": asset->metadata.dimensions
      }],
      defined(coverImage) => [coverImage{
        ...,
        "dimensions": asset->metadata.dimensions
      }],
      []
    ),
    "coverImage": coverImage{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    "additionalImages": additionalImages[]{
      ...,
      "dimensions": asset->metadata.dimensions
    },
    externalUrl
  }
`);
