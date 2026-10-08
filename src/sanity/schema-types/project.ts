import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Project name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Short subtitle",
      type: "string",
      description: "One short line describing what this design or product is.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Main cover image",
      type: "contentImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "additionalImages",
      title: "Additional images (optional)",
      type: "array",
      of: [defineArrayMember({ type: "contentImage" })],
    }),
    defineField({
      name: "externalUrl",
      title: "External URL (optional)",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first. Edit this field to reorder items.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "isVisible",
      title: "Visible on website",
      type: "boolean",
      initialValue: false,
      description: "Turn on and publish to show this project. Drafts never appear on the website.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "subtitle", media: "coverImage" } },
});
