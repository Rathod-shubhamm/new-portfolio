import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set root to avoid Turbopack picking up a stray package-lock.json
    // at ~/package-lock.json and resolving modules from the wrong directory.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
