/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: require('path').join(__dirname),
  // Disable dev overlay portal to avoid nextjs-portal 0x0 size / Cursor browser errors
  devIndicators: false,
}

module.exports = nextConfig
