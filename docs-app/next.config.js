const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: ["gray-matter"],
  // GitHub Pages: site is served at https://<user>.github.io/<repo>/
  basePath: process.env.BASE_PATH || "",
};

module.exports = nextConfig;
