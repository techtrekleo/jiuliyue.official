import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 轉換為純靜態網站輸出，徹底解決 Zeabur 502 問題 */
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
