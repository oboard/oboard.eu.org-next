/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.jianshu.io",
      },
      {
        protocol: "https",
        hostname: "sns-img-hw.xhscdn.net",
      },
      {
        protocol: "https",
        hostname: "sns-img-bd.xhscdn.com",
      },
      {
        protocol: "http",
        hostname: "sns-webpic-qc.xhscdn.com",
      },
      {
        protocol: "https",
        hostname: "mmbiz.qpic.cn",
      },
    ],
  },
};

module.exports = nextConfig;
