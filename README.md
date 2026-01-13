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

## Template for Friends（零程式碼客製）

你（或朋友）不需要會寫程式，只要照著做就能把它變成自己的「音樂人 Linktree 官網」。

### 0) 下載模板

最推薦用 GitHub：

- **Fork**：每個人有自己一份 repo（最好用）
- 或 **Use this template**：直接用模板建立新 repo
- 或 **Download ZIP**（不打算用 git 的人）

### 1) 本機啟動

```bash
cd app
npm install
npm run dev
```

開 `http://localhost:3000`

### 2) 用 /admin 改站台（不用改程式）

打開 `http://localhost:3000/admin`

你可以在這裡：

- 開關要不要顯示某些按鈕（YouTube/Spotify/Threads/桌布下載…）
- 調整按鈕順序
- 改文字、改連結、改 hover 顏色
- 改背景圖、Logo 圖
- 改「碎碎念」內容
- 改 YouTube Channel ID
- 改桌布下載（檔名清單、遠端 base URL）

改完後按右上角 **「下載 site-config.json」**。

### 3) 把設定檔放回 public/

把你下載的 `site-config.json` 放回：

- `app/public/site-config.json`（覆蓋原本那個）

然後重新跑 `npm run dev` 就會看到新設定。

### 4) 圖片放哪？

所有圖片都放在 `app/public/`，然後在 `site-config.json` 內填路徑，例如：

- 背景圖：`/bg_optimized.jpg`
- 標題 Logo：`/logo_title.png`
- 頁尾 Logo：`/logo.png`

### 5) YouTube API 金鑰（顯示最新作品 / 訂閱數用）

這個專案會讀環境變數：

- `NEXT_PUBLIC_YOUTUBE_API_KEY`

本機可以建 `app/.env.local`（**自己手動建立**）：

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=你的key
```

部署到 Railway 時也要在 Railway 的 Variables 裡新增同名變數。

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

下載頁面 `/photos` 會優先使用 `public/site-config.json` 裡的 `wallpapers.remoteBaseUrl`（填你的 `r2.dev / pages.dev` 網址），沒有設定時會讀本機 `public/galley`（`wallpapers.localBase`）。

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
