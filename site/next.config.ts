import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // site estático: gera a pasta out/ pronta para qualquer hospedagem (Vercel, Netlify, etc.)
  output: "export",
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
