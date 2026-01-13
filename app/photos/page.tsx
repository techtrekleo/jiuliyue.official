"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useMemo, useState } from "react";

type Photo = {
  id: string;
  filename: string;
  title?: string;
};

// 本機目前的照片來源（你放在 public/galley）
const LOCAL_BASE = "/galley";

// 之後換成 R2 時，把這個改成你的 r2.dev / pages.dev base URL
// 例如：https://<你的-bucket>.<你的-accountid>.r2.dev
const REMOTE_BASE = process.env.NEXT_PUBLIC_GALLERY_BASE_URL;

const PHOTOS: Photo[] = [
  { id: "p1", filename: "jiuliyue_001.png" },
  { id: "p2", filename: "jiuliyue_002.png" },
  { id: "p3", filename: "jiuliyue_003.png" },
  { id: "p4", filename: "jiuliyue_004.png" },
  { id: "p5", filename: "jiuliyue_005.png" },
  { id: "p6", filename: "jiuliyue_006.png" },
  { id: "p7", filename: "jiuliyue_007.png" },
  { id: "p8", filename: "jiuliyue_008.png" },
  { id: "p9", filename: "jiuliyue_009.png" },
  { id: "p10", filename: "jiuliyue_010.png" },
  { id: "p11", filename: "jiuliyue_011.png" },
];

function join(base: string, filename: string) {
  return `${base.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;
}

export default function PhotosPage() {
  const [active, setActive] = useState<Photo | null>(null);

  const base = useMemo(() => {
    // 有設定遠端就用遠端，沒有就用本機 public/galley
    return REMOTE_BASE?.trim() ? REMOTE_BASE.trim() : LOCAL_BASE;
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
              桌布下載
            </h1>
            <p className="mt-2 text-white/50 text-sm tracking-wider">
              先在官網瀏覽，點「下載」拿檔案。之後接 R2 也不需要改頁面。
            </p>
            <p className="mt-2 text-white/35 text-xs tracking-widest">
              使用提醒：僅供個人欣賞與分享，<span className="text-white/55">請勿商用</span>。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {PHOTOS.map((p) => {
            const src = join(base, p.filename);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                title="點擊預覽"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={src}
                    alt={p.title ?? "photo"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/35" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div
              className="w-full max-w-5xl rounded-2xl border border-white/10 bg-black/40 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="text-white/70 text-sm tracking-wider truncate">
                  {active.title ?? active.filename}
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-[11px] text-white/35 tracking-widest">
                    請勿商用
                  </div>
                  <a
                    href={join(base, active.filename)}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    下載原圖
                  </a>
                </div>
              </div>
              <div className="relative w-full aspect-[16/10] bg-black">
                <Image
                  src={join(base, active.filename)}
                  alt={active.title ?? "photo"}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

