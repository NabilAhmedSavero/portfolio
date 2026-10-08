// One-time migration of the existing visible fallbacks; never overwrites edited content.
// Preview: sanity exec scripts/seed-home.ts
// Publish after CLI login: sanity exec scripts/seed-home.ts --with-user-token -- --publish
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";
import { experienceFallback, homeFallback } from "../src/data/home";

process.loadEnvFile(".env.local");
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
assert.equal(projectId, "8vz5kyiz", "This migration is only for the existing portfolio project.");
assert.equal(dataset, "production", "This migration is only for the existing production dataset.");

const publish = process.argv.includes("--publish");
const { heroProfileImage, socialLinks, ...homeCopy } = homeFallback;
const preview = {
  projectId, dataset,
  home: {
    _id: "siteContent", _type: "siteContent", ...homeCopy,
    heroProfileImage,
    socialLinks: socialLinks.map((link) => ({ _type: "socialLink", ...link })),
    useCmsProjects: false,
  },
  experiences: experienceFallback.map(({ id, ...content }, displayOrder) => ({
    _id: id, _type: "experience", ...content, displayOrder, isVisible: true,
  })),
};

if (!publish) {
  console.log(JSON.stringify(preview, null, 2));
} else {
  const client = getCliClient({ projectId, dataset, apiVersion: "2025-06-19", useCdn: false });
  assert.ok(client.config().token, "Sign in with Sanity CLI, then use --with-user-token.");
  const connectedDataset = (await client.datasets.list()).find((item) => item.name === dataset);
  assert.equal(connectedDataset?.aclMode, "public",
    "Confirm public reads or configure a server-only Viewer token before migrating a private dataset.");

  const existing = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    '*[_type in ["siteContent", "experience"]]', {}, { perspective: "raw" },
  );
  const targetIds = new Set(["siteContent", ...experienceFallback.map((item) => item.id)]);
  assert.ok(existing.every((doc) => targetIds.has(doc._id)),
    "Existing content or drafts need review; refusing to replace or duplicate them.");

  async function uploadImage(image: { src: string; alt: string }) {
    assert.ok(image.src.startsWith("/images/home/") && !image.src.includes(".."));
    const asset = await client.assets.upload("image", readFileSync(`public${image.src}`), {
      filename: image.src.split("/").at(-1),
      contentType: "image/avif",
    });
    return { _type: "contentImage", alt: image.alt, asset: { _type: "reference", _ref: asset._id } };
  }

  const experienceDocuments = [];
  for (const { logo, ...document } of preview.experiences) {
    experienceDocuments.push({ ...document, ...(logo ? { logo: await uploadImage(logo) } : {}) });
  }
  const homeDocument = { ...preview.home, heroProfileImage: await uploadImage(heroProfileImage) };

  // Reruns may finish an interrupted migration, but must never overwrite edited fields.
  for (const expected of [homeDocument, ...experienceDocuments]) {
    const current = existing.find((doc) => doc._id === expected._id);
    if (current) {
      for (const [key, value] of Object.entries(expected)) {
        assert.deepEqual(current[key], value, `Existing ${expected._id}.${key} differs; review it manually.`);
      }
    }
  }

  let transaction = client.transaction();
  for (const document of experienceDocuments) transaction = transaction.createIfNotExists(document);
  await transaction.commit({ visibility: "sync" });
  const publishedExperiences = await client.fetch<Array<{ _id: string }>>(
    '*[_type == "experience" && isVisible == true] | order(displayOrder asc){_id}',
    {}, { perspective: "published" },
  );
  assert.deepEqual(publishedExperiences.map((doc) => doc._id), experienceDocuments.map((doc) => doc._id));
  console.log("Published Experience first: serving-hours, independent-designer.");

  await client.createIfNotExists(homeDocument, { visibility: "sync" });
  const publishedHome = await client.getDocument("siteContent");
  assert.equal(publishedHome?.heroDisplayName, homeFallback.heroDisplayName);
  console.log("Published Home / Site Content: siteContent. Work / Projects remain on local fallbacks.");
}
