import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project / Client Header",
      type: "string",
      description: "Project/Client header (e.g., 'Faction')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subheader Description",
      type: "string",
      description: "Subheader description (e.g., 'AI-integrated enterprise management system')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
      description: "For sorting project groups. Lower numbers appear first.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      description: "Upload and reorder multiple work images under this single project header.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              description: "Describe this image for screen readers.",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "name",
      title: "Legacy Name",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "image",
      title: "Legacy Image",
      type: "image",
      hidden: true,
    }),
    defineField({
      name: "coverImage",
      title: "Legacy Cover Image",
      type: "contentImage",
      hidden: true,
    }),
    defineField({
      name: "additionalImages",
      title: "Legacy Additional Images",
      type: "array",
      of: [defineArrayMember({ type: "contentImage" })],
      hidden: true,
    }),
    defineField({
      name: "displayOrder",
      title: "Legacy Display Order",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "externalUrl",
      title: "External URL (optional)",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "isVisible",
      title: "Visible on website",
      type: "boolean",
      initialValue: true,
      description: "Turn on and publish to show this project. Drafts never appear on the website.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Display order (legacy)",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      legacyTitle: "name",
      subtitle: "subtitle",
      media: "images.0",
      legacyMedia: "coverImage",
    },
    prepare({ title, legacyTitle, subtitle, media, legacyMedia }) {
      return {
        title: title || legacyTitle || "Untitled Project",
        subtitle,
        media: media || legacyMedia,
      };
    },
  },
});
