import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* 使用 Standalone 模式並確保路徑正確 */
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "./"), 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
