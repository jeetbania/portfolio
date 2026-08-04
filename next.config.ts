import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* There's an unrelated package.json/package-lock.json in the home
     directory (outside this project entirely), and Turbopack's
     workspace-root auto-detection walks up and finds it, which is wrong
     for this project and throws a build-time warning. Pinning the root
     here to this directory removes the ambiguity. */
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
