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
  heroRole: "Designer",
  heroProfileImage: { src: "/images/home/profile.avif", alt: "Profile Image" },
  locationTimezoneLabel: "BALIKPAPAN, ID",
  about: [
    {
      _type: "block", _key: "intro", style: "normal",
      markDefs: [{ _type: "link", _key: "profile-link", href: "https://x.com/saverovkn" }],
      children: [
        { _type: "span", _key: "intro-text", text: "Hi! I’m Nabil Ahmed Savero. You might know me as ", marks: [] },
        { _type: "span", _key: "intro-link", text: "Saverovkn", marks: ["profile-link"] },
        { _type: "span", _key: "intro-end", text: ".", marks: [] },
      ],
    },
    paragraph("interests", "I like designing AI products, workflow-heavy digital tools, and websites, especially when there’s a lot to simplify and make easier to use."),
    paragraph("background", "I come from a computer science background, but I’ve always been more drawn to the design side of technology, from interfaces and interactions to how a website or product feels as a whole."),
  ] satisfies RichText,
  get aboutMobile() {
    return this.about;
  },
  currently: [
    paragraph("availability", "I'm open to joining design studios and product teams building interesting digital products."),
  ] satisfies RichText,
  freelanceStartingPrice: "I'm also available for freelance design and development projects, taking on a limited number of projects at a time.",
  currentlyContactIntro: "If you think we'd be a good fit,",
  currentlyContactCta: { text: "let's talk", href: "mailto:saverovkn@gmail.com" },
  contactEmail: "saverovkn@gmail.com",
  socialLinks: [
    { _key: "twitter", label: "X/Twitter", displayText: "Saverovkn", href: "https://x.com/saverovkn" },
    { _key: "linkedin", label: "LinkedIn", displayText: "Nabil Savero", href: "https://www.linkedin.com/in/nabil-saveroo/" },
  ],
  footerText: "© 2026 Saverovkn",
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
