import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // 讓圖片在部署後也能正常顯示
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
