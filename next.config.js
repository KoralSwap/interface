// @ts-check
//** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/swap",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
