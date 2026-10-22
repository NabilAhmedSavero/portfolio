import { defineArrayMember, defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Home / Site Content",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "currently", title: "Currently" },
    { name: "contact", title: "Contacts / Footer" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "heroDisplayName",
      title: "Hero display name",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroRole",
      title: "Hero role / title",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroProfileImage",
      title: "Hero profile image",
      type: "contentImage",
      group: "hero",
    }),
    defineField({
      name: "locationTimezoneLabel",
      title: "Location / timezone label",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "about",
      title: "About paragraphs",
      type: "richText",
      group: "about",
    }),
    defineField({
      name: "aboutMobile",
      title: "About paragraphs — tablet / mobile (optional)",
      type: "richText",
      group: "about",
      description: "The published Framer page has different About copy below 1200px. Leave empty to use the main About copy on every screen.",
    }),
    defineField({
      name: "currently",
      title: "Currently paragraphs",
      type: "richText",
      group: "currently",
    }),
    defineField({
      name: "freelanceStartingPrice",
      title: "Freelance starting price",
      type: "string",
      group: "currently",
      description: "Enter the complete freelance paragraph, including the starting price and currency. Displayed exactly as entered.",
    }),
    defineField({
      name: "currentlyContactIntro",
      title: "Currently contact sentence — before the link",
      type: "string",
      group: "currently",
      description: "The introductory text before the contact CTA. Include any punctuation; the link follows after a space.",
    }),
    defineField({
      name: "currentlyContactCta",
      title: "Currently contact CTA",
      type: "object",
      group: "currently",
      fields: [
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({
          name: "href",
          title: "Link",
          type: "url",
          validation: (rule) =>
            rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
        }),
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "displayText",
              title: "Link display text (optional)",
              type: "string",
              description: "For example, Label can be X/Twitter and link display text can be your handle. Defaults to Label.",
            }),
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "footerText", title: "Footer text", type: "text", group: "contact" }),
    defineField({
      name: "useCmsProjects",
      title: "Use CMS project collection",
      type: "boolean",
      group: "publishing",
      initialValue: false,
      description:
        "Enable and publish after verifying your project migration. Disabled uses the existing local placeholders. Enabled respects an empty or entirely hidden CMS collection.",
    }),
  ],
  preview: { prepare: () => ({ title: "Home / Site Content" }) },
});
