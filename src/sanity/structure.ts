import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio content")
    .showIcons(false)
    .items([
      S.listItem().singleton("siteContent"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("project").title("Work / Projects"),
    ]);
