import type { NextConfig } from "next";
import { dataset, isSanityConfigured, projectId } from "./src/sanity/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: isSanityConfigured
      ? [{ protocol: "https", hostname: "cdn.sanity.io", pathname: `/images/${projectId}/${dataset}/**` }]
      : [],
  },
};

export default nextConfig;
