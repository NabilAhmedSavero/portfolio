import { PortableText, type PortableTextBlockComponent, type PortableTextComponents } from "@portabletext/react";
import { safeHref } from "@/sanity/lib/links";
import type { RichText as RichTextValue } from "@/sanity/types";

const Paragraph: PortableTextBlockComponent = ({ children }) => <p className="text-muted">{children}</p>;

const components: Partial<PortableTextComponents> = {
  block: Paragraph,
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(typeof value?.href === "string" ? value.href : null);
      return href ? (
        <a href={href} target={/^https?:/.test(href) ? "_blank" : undefined} rel={/^https?:/.test(href) ? "noopener noreferrer" : undefined} className="underline underline-offset-4">{children}</a>
      ) : <>{children}</>;
    },
  },
};

export function RichText({ value }: { value: RichTextValue }) {
  return <PortableText value={value} components={components} onMissingComponent={false} />;
}
