"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SiteConfig } from "../lib/siteConfig";
import { fetchSiteConfig } from "../lib/siteConfig";

type Photo = {
  id: string;
  filename: string;
  title?: string;
};

function join(base: string, filename: string) {
  return `${base.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;
}

export default function PhotosPage() {
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [cfgError, setCfgError] = useState<string | null>(null);
  const [active, setActive] = useState<Photo | null>(null);

  useEffect(() => {
    fetchSiteConfig()
      .then((c) => setCfg(c))
      .catch((e) => {
        console.error("Failed to load site-config.json", e);
        setCfgError("找不到 site-config.json，請確認 public/ 內有此檔案。");
      });
  }, []);

  const enabled = cfg?.wallpapers?.enabled !== false;
  const title = cfg?.wallpapers?.title ?? "桌布下載";
  const note = cfg?.wallpapers?.note ?? "使用提醒：僅供個人欣賞與分享，請勿商用。";
  const base = useMemo(() => {
    const remote = cfg?.wallpapers?.remoteBaseUrl?.trim();
    if (remote) return remote;
    return cfg?.wallpapers?.localBase?.trim() || "/galley";
  }, [cfg]);

  const photos: Photo[] = useMemo(() => {
    const files = cfg?.wallpapers?.files?.filter(Boolean) ?? [];
    return files.map((filename, idx) => ({ id: `p${idx + 1}`, filename }));
  }, [cfg]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
              {title}
            </h1>
            <p className="mt-2 text-white/50 text-sm tracking-wider">
              先在官網瀏覽，點「下載」拿檔案。之後接 R2 也不需要改頁面。
            </p>
            <p className="mt-2 text-white/35 text-xs tracking-widest">
              {note.replace("請勿商用", "")}
              <span className="text-white/55">請勿商用</span>。
            </p>
          </div>
        </div>

        {cfgError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-200/80 tracking-wide">
            {cfgError}
          </div>
        )}

        {!enabled && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-white/60 text-sm tracking-wide">
            這個模板目前把「桌布下載」關閉了（可在 /admin 重新開啟）。
          </div>
        )}

        {enabled && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((p) => {
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
        )}
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

