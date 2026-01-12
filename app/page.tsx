"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Youtube, Music, Headphones, AtSign, Crown, Play, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [latestVideoId, setLatestVideoId] = useState<string | null>(null);
  const [latestVideoTitle, setLatestVideoTitle] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<string | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);

  // 點擊加油的動畫邏輯
  const addHeart = () => {
    const newHeart = { id: Date.now(), x: Math.random() * 100 - 50 };
    setHearts((prev) => [...prev, newHeart]);
    // 3秒後移除，避免佔用記憶體
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 3000);
  };

  const whispers = [
    "今天的月色，好像在哪場夢裡見過。",
    "聽說，旋律是靈魂在說話。",
    "有些歌，只想在沒人的深夜唱給你聽。",
    "如果你也在這，那就太好了。",
  ];

  const [currentWhisper, setCurrentWhisper] = useState("");

  useEffect(() => {
    // 隨機選一句碎碎念
    setCurrentWhisper(whispers[Math.floor(Math.random() * whispers.length)]);
    
    const fetchYouTubeData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const channelId = "UCZVT570EWJ64ibL-re9CFpQ";
        if (!apiKey || apiKey.includes("你的")) return;

        // 1. 抓取最新影片資訊
        const videoRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`
        );
        const videoData = await videoRes.json();
        if (videoData.items?.[0]) {
          setLatestVideoId(videoData.items[0].id.videoId);
          setLatestVideoTitle(videoData.items[0].snippet.title.split(" (")[0]);
        }

        // 2. 抓取頻道統計數據 (訂閱數)
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=statistics`
        );
        const channelData = await channelRes.json();
        if (channelData.items?.[0]) {
          const count = parseInt(channelData.items[0].statistics.subscriberCount);
          setSubscriberCount(count >= 1000 ? (count / 1000).toFixed(1) + "K" : count.toString());
        }
      } catch (e) {
        console.error("YouTube API Error", e);
      }
    };
    fetchYouTubeData();
  }, []);

  const links = [
    {
      name: "YouTube 頻道",
      url: "https://www.youtube.com/@Jiuliyue",
      icon: <Youtube className="w-5 h-5" />,
      color: "from-[#FF0000] to-[#b30000]",
    },
    {
      name: "挺九黎月 ‧ 每月 $25 守護計畫",
      url: "https://www.youtube.com/channel/UCZVT570EWJ64ibL-re9CFpQ/join",
      icon: <Crown className="w-5 h-5 text-yellow-400" />,
      color: "from-[#8B0000] to-[#4a0000]",
      special: true,
      price: "$25",
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/artist/2Cc6ttn7VqpF6AFWBPKhca",
      icon: <Headphones className="w-5 h-5" />,
      color: "from-[#1DB954] to-[#128c3d]",
    },
    {
      name: "Apple Music",
      url: "https://music.apple.com/us/artist/%E4%B9%9D%E9%BB%8E%E6%9C%88/1855064511",
      icon: <Music className="w-5 h-5" />,
      color: "from-[#FA243C] to-[#b81b2c]",
    },
    {
      name: "Threads",
      url: "https://www.threads.net/@jiuliyue.official",
      icon: <AtSign className="w-5 h-5" />,
      color: "from-[#000000] to-[#333333]",
    },
  ];

  return (
    <div 
      className="relative min-h-screen w-full overflow-y-auto overflow-x-hidden bg-black pb-20 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 背景圖片 */}
      <div className="fixed inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/bg_optimized.jpg"
            alt="背景"
            fill
            className="object-cover pointer-events-none"
            priority
            quality={90}
            draggable={false}
          />
          <div className="absolute inset-0 z-10 bg-transparent"></div>
        </div>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] z-20"></div>
      </div>

      {/* 主要內容區域 */}
      <main className="relative z-30 flex flex-col items-center pt-32 px-6">
        {/* 中心標題圖片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative mb-12 w-48 sm:w-64 md:w-80 h-auto"
        >
          <div className="relative">
            <Image
              src="/logo_title.png"
              alt="九黎月"
              width={600}
              height={200}
              className="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] pointer-events-none"
              priority
              draggable={false}
            />
            <div className="absolute inset-0 z-10 bg-transparent"></div>
          </div>
        </motion.div>

        {/* 個人介紹 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mb-12 text-center flex flex-col gap-2 relative"
        >
          <p className="text-white/60 text-sm md:text-[15px] font-light tracking-[0.25em] leading-loose">
            有些夜晚，宛若一場將醒未醒的夢。
          </p>
          <p className="text-white/80 text-[15px] md:text-16px font-normal tracking-[0.3em] mt-1">
            我是 <span className="text-white">九黎月</span>，陪你度過每個漫長且靜謐的夜。
          </p>

          {/* 深夜呢喃 & 加油按鈕 */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {currentWhisper && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 backdrop-blur-sm"
              >
                <p className="text-white/40 text-[11px] italic tracking-widest">
                  「 {currentWhisper} 」
                </p>
              </motion.div>
            )}
            
            <button
              onClick={addHeart}
              className="group relative p-3 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
            >
              <Heart className="w-5 h-5 text-red-400 group-hover:fill-red-400 transition-all" />
              
              {/* 噴發的愛心動畫 */}
              {hearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -100, x: heart.x, scale: 0.5 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute pointer-events-none text-red-400"
                  style={{ left: "50%", top: "50%" }}
                >
                  <Heart className="w-4 h-4 fill-current" />
                </motion.div>
              ))}
            </button>
            <span className="text-white/20 text-[10px] tracking-tighter uppercase font-bold">點亮星火</span>
          </div>
        </motion.div>

        {/* 連結列表 */}
        <div className="flex flex-col gap-5 w-full max-w-[340px] sm:max-w-[420px]">
          {/* 最新作品：就算抓不到 API，也先顯示（fallback 連到頻道） */}
          <motion.a
              href={
                latestVideoId
                  ? `https://www.youtube.com/watch?v=${latestVideoId}`
                  : "https://www.youtube.com/@Jiuliyue"
              }
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative flex items-center justify-center px-8 py-6 rounded-2xl border border-yellow-500/50 overflow-hidden transition-all duration-500 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            >
              <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-md"></div>
              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className="flex items-center gap-3">
                  <Play className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
                  <span className="text-yellow-400 font-bold tracking-[0.2em] text-[15px]">
                    最新作品
                  </span>
                </div>
                <span className="text-yellow-200/60 text-[10px] sm:text-[11px] tracking-widest font-light mt-1 text-center max-w-[300px] sm:max-w-[350px] leading-relaxed">
                  {latestVideoTitle ?? "正在抓取最新作品…"}
                </span>
              </div>
              {latestVideoId && (
                <div className="absolute top-2 right-3 flex gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">New Release</span>
                </div>
              )}
            </motion.a>

          {links.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-center px-8 py-5 rounded-2xl border border-white/10 overflow-hidden transition-all duration-500"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md group-hover:opacity-0 transition-opacity duration-500"></div>
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${link.color} transition-opacity duration-500`}></div>
              <div className="flex items-center justify-center gap-4 relative z-10 w-full">
                <motion.span className="w-6 flex justify-center text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {link.icon}
                </motion.span>
                <span className="text-white/80 group-hover:text-white font-light tracking-[0.15em] text-[15px] transition-colors duration-300">
                  {link.name}
                </span>
              </div>
              <div className="absolute right-6 z-10 text-white/20 group-hover:text-white/100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_10px_white]"></div>
              </div>
              {link.special && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-500/10 backdrop-blur-sm text-[9px] text-yellow-200/50 font-bold tracking-widest border-b border-l border-yellow-500/20 rounded-bl-xl group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100 transition-all duration-500">
                  {link.price && <span className="mr-2 opacity-50 group-hover:opacity-100">{link.price}</span>}
                  VIP
                </div>
              )}
            </motion.a>
          ))}
        </div>

        {/* 頁尾 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="relative w-12 h-12 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <Image
              src="/logo.png"
              alt="Official Logo"
              width={48}
              height={48}
              className="w-full h-auto object-contain pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-0 z-10 bg-transparent"></div>
          </div>
          {subscriberCount && (
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/50 tracking-widest uppercase">
              {subscriberCount} Subscribers
            </div>
          )}
          <p className="text-white/20 text-[9px] tracking-[0.3em] uppercase">
            © 2026 Jiuliyue Official
          </p>
        </motion.div>
      </main>
    </div>
  );
}
