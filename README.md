This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Wallpapers (桌布下載) + Cloudflare R2 (推薦)

本機照片放在 `public/galley/`（目前資料夾名稱就是 `galley`）。

### 命名規則

- 圖檔請用：`jiuliyue_001.png`、`jiuliyue_002.png`…（`jiuliyue_###.<ext>`）

### 自動重新命名 + 上傳到 R2（只處理「不符合命名」的檔案）

我們提供腳本：`scripts/gallery_r2_sync.sh`

- 只重新命名（不會上傳）：

```bash
cd app
./scripts/gallery_r2_sync.sh rename
```

- 重新命名 + 上傳（需要 aws CLI + R2 憑證）：

```bash
cd app
export R2_ACCOUNT_ID="..."
export R2_ACCESS_KEY_ID="..."
export R2_SECRET_ACCESS_KEY="..."
export R2_BUCKET="jiuliyue-gallery"
export R2_PREFIX="galley/"
./scripts/gallery_r2_sync.sh rename+upload
```

下載頁面 `/photos` 會優先使用 `NEXT_PUBLIC_GALLERY_BASE_URL`（設定為你的 `r2.dev` 網址），沒有設定時會讀本機 `public/galley`。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
