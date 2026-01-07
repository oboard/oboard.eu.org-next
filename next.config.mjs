/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.jianshu.io',
      },
      {
        protocol: 'https',
        hostname: 'sns-img-hw.xhscdn.net',
      },
      {
        protocol: 'https',
        hostname: 'sns-img-bd.xhscdn.com',
      },
      {
        protocol: 'http',
        hostname: 'sns-webpic-qc.xhscdn.com',
      },
      {
        protocol: 'https',
        hostname: 'mmbiz.qpic.cn',
      },
      {
        protocol: 'https',
        hostname: 'img.xiumi.us',
      },
      {
        protocol: 'https',
        hostname: 'statics.xiumi.us',
      },
      {
        protocol: 'http',
        hostname: 'mmbiz.qpic.cn',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.crossbell.io',
      },
      {
        protocol: 'https',
        hostname: 'obscloud.ulearning.cn',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.opacity.ink',
      },
      {
        protocol: 'https',
        hostname: 'blog-1252515394.cos.ap-shanghai.myqcloud.com',
      },
      {
        protocol: 'https',
        hostname: 'manjaro.org',
      },
      {
        protocol: 'https',
        hostname: 'c.s-microsoft.com',
      },
      {
        protocol: 'https',
        hostname: 'www.android.com',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
