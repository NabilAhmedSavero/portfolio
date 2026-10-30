import { defineArrayMember, defineField, defineType } from "sanity";

export const richText = defineType({
  name: "richText",
  title: "Paragraphs",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Paragraph", value: "normal" }],
      lists: [],
      marks: {
        decorators: [],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "Link URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "hoverColor",
                title: "Hover color (optional)",
                type: "color",
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
