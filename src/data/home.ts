import type { RichText } from "@/sanity/types";

// Visible copy and current assets from nabilsavero.framer.website, October 8, 2026.
// These remain local fallbacks; published Sanity content takes precedence.
function paragraph(key: string, text: string): RichText[number] {
  return {
    _type: "block", _key: key, style: "normal", markDefs: [],
    children: [{ _type: "span", _key: `${key}-text`, text, marks: [] }],
  };
}

export const homeFallback = {
  heroDisplayName: "Nabil Savero",
  roleSubtitle: "@saverovkn",
  heroRole: "@saverovkn",
  heroProfileImage: { src: "/images/home/profile.avif", alt: "Profile Image" },
  locationTimezoneLabel: "BALIKPAPAN, ID",
  cityHoverColor: undefined as string | undefined,
  about: [
    {
      _type: "block", _key: "intro", style: "normal",
      markDefs: [{ _type: "link", _key: "profile-link", href: "https://x.com/saverovkn" }],
      children: [
        { _type: "span", _key: "intro-text", text: "Hi! I'm Nabil Ahmed Savero, based in Balikpapan. You might know me as ", marks: [] },
        { _type: "span", _key: "intro-link", text: "Saverovkn", marks: ["profile-link"] },
        { _type: "span", _key: "intro-end", text: ".", marks: [] },
      ],
    },
    paragraph("interests", "I like designing AI products, workflow-heavy digital tools, and websites, occasionally writing code to build and ship them end-to-end."),
    paragraph("background", "I come from a computer science background, but most of my work has always been on the design side, collaborating with founders and teams across tech startups, creative studios, and independent brands."),
  ] satisfies RichText,
  get aboutMobile() {
    return this.about;
  },
  currently: [
    paragraph("availability", "I'm open to joining design studios and product teams building interesting digital products."),
    paragraph("freelance", "I'm also available for freelance design and development projects, taking on a limited number of projects at a time."),
    {
      _type: "block",
      _key: "collaborations",
      style: "normal",
      markDefs: [
        { _type: "link", _key: "faction-link", href: "https://faction.ai" },
        { _type: "link", _key: "serving-hours-link", href: "https://servinghours.com" },
        { _type: "link", _key: "plied-link", href: "https://plied.ai" },
        { _type: "link", _key: "cara-florist-link", href: "https://caraflorist.com/" },
        { _type: "link", _key: "cta-link", href: "mailto:saverovkn@gmail.com" },
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
        { _type: "span", _key: "collab-5", text: ", and others. If you think we'd be a good fit, ", marks: [] },
        { _type: "span", _key: "collab-cta", text: "let's talk", marks: ["cta-link"] },
        { _type: "span", _key: "collab-6", text: ".", marks: [] },
      ],
    },
  ] satisfies RichText,
  freelanceStartingPrice: "I'm also available for freelance design and development projects, taking on a limited number of projects at a time.",
  currentlyContactIntro: "If you think we'd be a good fit,",
  currentlyContactCta: { text: "let's talk", href: "mailto:saverovkn@gmail.com" },
  contactsCopy: [
    {
      _type: "block",
      _key: "contacts-copy",
      style: "normal",
      markDefs: [
        { _type: "link", _key: "email-link", href: "mailto:saverovkn@gmail.com" },
        { _type: "link", _key: "twitter-link", href: "https://x.com/saverovkn" },
        { _type: "link", _key: "linkedin-link", href: "https://www.linkedin.com/in/nabil-saveroo/" },
      ],
      children: [
        { _type: "span", _key: "c-1", text: "You can reach out to me via email ", marks: [] },
        { _type: "span", _key: "c-email", text: "saverovkn@gmail.com", marks: ["email-link"] },
        { _type: "span", _key: "c-2", text: ", find me on ", marks: [] },
        { _type: "span", _key: "c-twitter", text: "X/Twitter", marks: ["twitter-link"] },
        { _type: "span", _key: "c-3", text: ", or connect with me on ", marks: [] },
        { _type: "span", _key: "c-linkedin", text: "LinkedIn", marks: ["linkedin-link"] },
        { _type: "span", _key: "c-4", text: ".", marks: [] },
      ],
    },
  ] satisfies RichText,
  contactEmail: "saverovkn@gmail.com",
  socialLinks: [
    { _key: "twitter", label: "X/Twitter", displayText: "Saverovkn", href: "https://x.com/saverovkn" },
    { _key: "linkedin", label: "LinkedIn", displayText: "Nabil Savero", href: "https://www.linkedin.com/in/nabil-saveroo/" },
  ],
  footerText: "© 2026 saverovkn",
};

export type HomeExperience = {
  id: string;
  position: string;
  company: string;
  period: string;
  description: string;
  logo?: { src: string; alt: string };
  monogram?: string;
};

export const experienceFallback: readonly HomeExperience[] = [
  {
    id: "serving-hours",
    position: "Product Designer at Serving Hours",
    company: "SERVING HOURS",
    period: "2026",
    description: "Worked on early-stage digital products, helping shape ideas, flows, and interfaces from exploration through refinement.",
    logo: { src: "/images/home/serving-hours.avif", alt: "Serving Hours" },
  },
  {
    id: "independent-designer",
    position: "Independent Designer",
    company: "FREELANCE",
    period: "2025 - NOW",
    description: "Taking on selected design projects for small teams, businesses, and independent clients.",
    monogram: "NS",
  },
];
