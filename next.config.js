/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.jianshu.io",
      },
    ],
  },
};

module.exports = nextConfig;
