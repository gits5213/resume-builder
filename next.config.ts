import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH ?? "";
const assetPrefix = basePath ? `${basePath}/` : undefined;
const isStaticExport = Boolean(basePath);

const nextConfig: NextConfig = {
  // Only use static export when building for GitHub Pages (BASE_PATH set).
  // Local dev/build keeps API routes (e.g. /api/visit) working.
  ...(isStaticExport && { output: "export" }),
  ...(basePath && { basePath, assetPrefix }),
  ...(isStaticExport && { trailingSlash: true, images: { unoptimized: true } }),
};

export default nextConfig;
