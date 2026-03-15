# 使用 Debian bookworm-slim 作為基礎映像 (解決 Alpine/musl 與 lightningcss 的相容性問題)
FROM node:20-bookworm-slim

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 lockfile
COPY package.json package-lock.json ./

# 安裝所有相依套件 (使用 npm)
RUN npm ci

# 複製所有專案檔案
COPY . .

# 進行 Next.js 建置
RUN npm run build

# 暴露對外埠號
EXPOSE 8080

# 啟動伺服器 (綁定 0.0.0.0 以供 Zeabur 路由)
CMD ["npm", "start"]
