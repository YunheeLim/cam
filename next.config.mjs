/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        destination:
          'https://5mv4zmu94s.apigw.ntruss.com/custom/v1/34638/138074ec68ed56d430eac26486a538e26fa9b82b8fdc244935f2f7d9fd59f311/general',
        source: '/api/ocrProxy',
      },
    ];
  },
};

export default nextConfig;
