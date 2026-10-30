import { defineArrayMember, defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Home / Site Content",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "Intro (Section 1)" },
    { name: "experience", title: "Experience (Section 2)" },
    { name: "currently", title: "Currently (Section 3)" },
    { name: "contact", title: "Contacts & Footer" },
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
      name: "roleSubtitle",
      title: "Role subtitle",
      type: "string",
      group: "hero",
      initialValue: "@saverovkn",
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
      name: "cityHoverColor",
      title: "City ('Balikpapan') hover color",
      type: "color",
      group: "about",
    }),
    defineField({
      name: "about",
      title: "Intro paragraphs",
      type: "richText",
      group: "about",
    }),
    defineField({
      name: "aboutMobile",
      title: "Intro paragraphs — tablet / mobile (optional)",
      type: "richText",
      group: "about",
      description: "Leave empty to use the main Intro copy on every screen.",
    }),
    defineField({
      name: "experience",
      title: "Experience paragraphs",
      type: "richText",
      group: "experience",
    }),
    defineField({
      name: "currently",
      title: "Currently paragraphs",
      type: "richText",
      group: "currently",
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
            defineField({
              name: "hoverColor",
              title: "Hover color (optional)",
              type: "color",
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
