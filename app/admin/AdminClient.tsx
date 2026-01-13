"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteConfig } from "../lib/siteConfig";
import { fetchSiteConfig } from "../lib/siteConfig";

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function safeJson(cfg: SiteConfig) {
  return JSON.stringify(cfg, null, 2) + "\n";
}

export default function AdminClient() {
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchSiteConfig()
      .then((c) => setCfg(c))
      .catch((e) => {
        console.error(e);
        setError("讀取 /public/site-config.json 失敗。請確認檔案存在，並重新整理。");
      });
  }, []);

  const jsonText = useMemo(() => (cfg ? safeJson(cfg) : ""), [cfg]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-14">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-wide">Admin</h1>
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-200/80 text-sm tracking-wide">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!cfg) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-14">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-wide">Admin</h1>
          <div className="mt-6 text-white/60 text-sm tracking-wide">載入中…</div>
        </div>
      </div>
    );
  }

  const set = (updater: (prev: SiteConfig) => SiteConfig) => {
    setCfg((prev) => {
      if (!prev) return prev;
      setDirty(true);
      return updater(prev);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-14">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">模板設定 / Admin</h1>
            <p className="mt-2 text-white/50 text-sm tracking-wider">
              改完後按「下載 site-config.json」，把檔案放回 <code className="text-white/70">public/</code> 覆蓋即可。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => downloadText("site-config.json", jsonText)}
              className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm hover:bg-white/15 transition-colors"
            >
              下載 site-config.json
            </button>
          </div>
        </div>

        {dirty && (
          <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-yellow-100/80 text-sm tracking-wide">
            你有尚未下載的新變更。
          </div>
        )}

        {/* Site */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">站台文字</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">網站標題（SEO）</span>
              <input
                value={cfg.site.title}
                onChange={(e) => set((p) => ({ ...p, site: { ...p.site, title: e.target.value } }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">網站描述（SEO）</span>
              <input
                value={cfg.site.description}
                onChange={(e) =>
                  set((p) => ({ ...p, site: { ...p.site, description: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">Bio（每行一句）</span>
              <textarea
                value={cfg.site.bioLines.join("\n")}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    site: {
                      ...p.site,
                      bioLines: e.target.value
                        .split("\n")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    },
                  }))
                }
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
          </div>
        </section>

        {/* Theme */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">圖片路徑（放在 public/）</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">背景圖</span>
              <input
                value={cfg.theme.backgroundImage}
                onChange={(e) =>
                  set((p) => ({ ...p, theme: { ...p.theme, backgroundImage: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">標題 Logo</span>
              <input
                value={cfg.theme.logoTitleImage}
                onChange={(e) =>
                  set((p) => ({ ...p, theme: { ...p.theme, logoTitleImage: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">頁尾 Logo</span>
              <input
                value={cfg.theme.footerLogoImage}
                onChange={(e) =>
                  set((p) => ({ ...p, theme: { ...p.theme, footerLogoImage: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
          </div>
        </section>

        {/* YouTube */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">YouTube 設定</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">Channel ID</span>
              <input
                value={cfg.youtube.channelId}
                onChange={(e) =>
                  set((p) => ({ ...p, youtube: { ...p.youtube, channelId: e.target.value.trim() } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">「最新作品」按鈕文字</span>
              <input
                value={cfg.youtube.latestButtonLabel}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    youtube: { ...p.youtube, latestButtonLabel: e.target.value },
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
          </div>
        </section>

        {/* Features */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">功能開關</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["enableWhispers", "碎碎念（whispers）"],
              ["enableCheerButton", "加油按鈕（點亮星火）"],
              ["enableYouTubeLatest", "顯示「最新作品」按鈕"],
              ["enableYouTubePlayer", "顯示底部播放器"],
              ["enableYouTubeShuffle", "顯示 Shuffle 按鈕"],
            ].map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3"
              >
                <span className="text-sm text-white/70 tracking-wide">{label}</span>
                <input
                  type="checkbox"
                  checked={(cfg.features as any)[key]}
                  onChange={(e) =>
                    set((p) => ({
                      ...p,
                      features: { ...p.features, [key]: e.target.checked } as any,
                    }))
                  }
                  className="h-5 w-5 accent-yellow-400"
                />
              </label>
            ))}
            <label className="md:col-span-2 flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">點亮星火文字</span>
              <input
                value={cfg.features.cheerLabel}
                onChange={(e) =>
                  set((p) => ({ ...p, features: { ...p.features, cheerLabel: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">碎碎念（每行一句）</span>
              <textarea
                value={cfg.features.whispers.join("\n")}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    features: {
                      ...p.features,
                      whispers: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    },
                  }))
                }
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
          </div>
        </section>

        {/* Links */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">
            按鈕清單（可開關/改文字/改連結/排序）
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {cfg.links.map((l, idx) => (
              <div key={l.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={l.enabled}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) => (i === idx ? { ...x, enabled: e.target.checked } : x)),
                        }))
                      }
                      className="h-5 w-5 accent-yellow-400"
                    />
                    <div className="text-sm text-white/75 tracking-wide">{l.id}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() =>
                        set((p) => {
                          const next = [...p.links];
                          const t = next[idx - 1];
                          next[idx - 1] = next[idx];
                          next[idx] = t;
                          return { ...p, links: next };
                        })
                      }
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30"
                    >
                      上移
                    </button>
                    <button
                      type="button"
                      disabled={idx === cfg.links.length - 1}
                      onClick={() =>
                        set((p) => {
                          const next = [...p.links];
                          const t = next[idx + 1];
                          next[idx + 1] = next[idx];
                          next[idx] = t;
                          return { ...p, links: next };
                        })
                      }
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30"
                    >
                      下移
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">顯示文字</span>
                    <input
                      value={l.label}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">連結 URL（內部用 /photos）</span>
                    <input
                      value={l.url}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) => (i === idx ? { ...x, url: e.target.value } : x)),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">Icon</span>
                    <select
                      value={l.icon}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) => (i === idx ? { ...x, icon: e.target.value as any } : x)),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    >
                      <option value="Youtube">Youtube</option>
                      <option value="Crown">Crown</option>
                      <option value="Headphones">Headphones</option>
                      <option value="Music">Music</option>
                      <option value="AtSign">AtSign</option>
                      <option value="Image">Image</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">Hover 漸層（Tailwind）</span>
                    <input
                      value={l.gradient}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) => (i === idx ? { ...x, gradient: e.target.value } : x)),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">Badge（可空白）</span>
                    <input
                      value={l.badge ?? ""}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) =>
                            i === idx ? { ...x, badge: e.target.value || undefined } : x
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-white/50 tracking-widest">Badge 左側文字（例如 $25）</span>
                    <input
                      value={l.badgeLeft ?? ""}
                      onChange={(e) =>
                        set((p) => ({
                          ...p,
                          links: p.links.map((x, i) =>
                            i === idx ? { ...x, badgeLeft: e.target.value || undefined } : x
                          ),
                        }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wallpapers */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">桌布下載 /photos</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
              <span className="text-sm text-white/70 tracking-wide">啟用桌布下載</span>
              <input
                type="checkbox"
                checked={cfg.wallpapers.enabled}
                onChange={(e) => set((p) => ({ ...p, wallpapers: { ...p.wallpapers, enabled: e.target.checked } }))}
                className="h-5 w-5 accent-yellow-400"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">頁面標題</span>
              <input
                value={cfg.wallpapers.title}
                onChange={(e) => set((p) => ({ ...p, wallpapers: { ...p.wallpapers, title: e.target.value } }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">提示文字</span>
              <input
                value={cfg.wallpapers.note}
                onChange={(e) => set((p) => ({ ...p, wallpapers: { ...p.wallpapers, note: e.target.value } }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">本機資料夾 base（public 內）</span>
              <input
                value={cfg.wallpapers.localBase}
                onChange={(e) => set((p) => ({ ...p, wallpapers: { ...p.wallpapers, localBase: e.target.value } }))}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">遠端 base URL（可留空）</span>
              <input
                value={cfg.wallpapers.remoteBaseUrl ?? ""}
                onChange={(e) =>
                  set((p) => ({ ...p, wallpapers: { ...p.wallpapers, remoteBaseUrl: e.target.value } }))
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2">
              <span className="text-xs text-white/50 tracking-widest">檔名清單（每行一個檔名）</span>
              <textarea
                value={cfg.wallpapers.files.join("\n")}
                onChange={(e) =>
                  set((p) => ({
                    ...p,
                    wallpapers: {
                      ...p.wallpapers,
                      files: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    },
                  }))
                }
                rows={6}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              />
            </label>
          </div>
        </section>

        {/* Raw JSON */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold tracking-widest text-white/80">JSON（進階）</h2>
          <p className="mt-2 text-white/50 text-xs tracking-wider">
            如果你想直接複製貼上，也可以用這段 JSON。一般情況只要按上面的下載即可。
          </p>
          <textarea
            value={jsonText}
            readOnly
            rows={14}
            className="mt-4 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-white/70 outline-none"
          />
        </section>
      </div>
    </div>
  );
}

