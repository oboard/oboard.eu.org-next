/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      //接口请求 前缀带上/utestapi/
      {
        source: `/utestapi/:path*`,
        destination: `https://utestapi.ulearning.cn/:path*`,
      },
      {
        source: `/courseapi/:path*`,
        destination: `https://courseapi.ulearning.cn/:path*`,
      },
    ];
  },
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
      {
        protocol: "https",
        hostname: "img.xiumi.us",
      },
      {
        protocol: "https",
        hostname: "statics.xiumi.us",
      },
      {
        protocol: "http",
        hostname: "mmbiz.qpic.cn",
      },
    ],
  },
};

module.exports = nextConfig;
