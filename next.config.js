/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  // Bundle the ESM-only Auth0 SDK into Pages API routes; loading it as an
  // external fails to resolve its `./server` export under Turbopack.
  transpilePackages: ['@auth0/nextjs-auth0'],
}

module.exports = nextConfig
