export function safeHref(value: string | null | undefined): string | null {
  const href = value?.trim();
  if (!href || /[\u0000-\u0020\u007f]/.test(href)) return null;
  if (href.startsWith("#") || (href.startsWith("/") && !href.startsWith("//") && !href.includes("\\"))) {
    return href;
  }

  try {
    const url = new URL(href);
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) ? href : null;
  } catch {
    return null;
  }
}
