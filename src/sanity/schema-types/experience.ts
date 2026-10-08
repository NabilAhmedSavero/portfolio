import { defineField, defineType } from "sanity";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "position",
      title: "Position / title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company / organization",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "period",
      title: "Display date / period",
      type: "string",
      description: "Displayed exactly as entered; no date parsing or reformatting.",
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "logo", title: "Logo / monogram (optional)", type: "contentImage" }),
    defineField({
      name: "monogram",
      title: "Text monogram (optional)",
      type: "string",
      description: "Shown in the existing monogram style when no logo image is supplied.",
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
      description: "Turn on and publish to show this item. Drafts never appear on the website.",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{ title: "Display order", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] }],
  preview: { select: { title: "position", subtitle: "company", media: "logo" } },
});
