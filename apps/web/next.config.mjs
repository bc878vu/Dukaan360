/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@dukaan360/types",
    "@dukaan360/schemas",
    "@dukaan360/business-logic",
    "@dukaan360/ui",
    "@dukaan360/localization",
    "@dukaan360/api-client",
    "@dukaan360/utilities",
    "@dukaan360/config",
  ],
};

export default nextConfig;
