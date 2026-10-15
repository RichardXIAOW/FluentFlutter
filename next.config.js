/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 让 public/ 下的 .html 能按原样访问（flutter-new-project-setup.html 靠这个）
  async headers() {
    return [
      {
        source: '/handbook/:path*.html',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=utf-8' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
