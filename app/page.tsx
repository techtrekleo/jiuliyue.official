"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Youtube, Music, Headphones, AtSign, Crown, Play, Pause, Volume2, SkipForward } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// 使用最通用的引用路徑，並保留 dynamic 以避免 SSR 衝突
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Home() {
  const [latestVideoId, setLatestVideoId] = useState<string | null>(null);
  const [latestVideoTitle, setLatestVideoTitle] = useState<string | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<string | null>(null);
  
  // 播放器狀態
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef<any>(null);

  useEffect(() => {
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

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
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
      onContextMenu={(e) => e.preventDefault()} // 全域禁用右鍵
    >
      {/* 背景圖片 */}
      <div className="fixed inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/bg_optimized.jpg"
            alt="背景"
            fill
            className="object-cover pointer-events-none" // 禁用滑鼠事件
            priority
            quality={90}
            draggable={false} // 禁用拖拽
          />
          {/* 透明保護層 */}
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
            {/* Logo 透明保護層 */}
            <div className="absolute inset-0 z-10 bg-transparent"></div>
          </div>
        </motion.div>

        {/* 連結列表 (Linktree Style) */}
        <div className="flex flex-col gap-5 w-full max-w-[340px] sm:max-w-[420px]">
          {/* 最新影片按鈕 - 僅在抓取到資料後顯示 */}
          {latestVideoId && (
            <motion.a
              href={`https://www.youtube.com/watch?v=${latestVideoId}`}
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
                    聽最新的一首歌
                  </span>
                </div>
                {latestVideoTitle && (
                  <span className="text-yellow-200/60 text-[10px] sm:text-[11px] tracking-widest font-light mt-1 text-center max-w-[300px] sm:max-w-[350px] leading-relaxed">
                    {latestVideoTitle}
                  </span>
                )}
              </div>
              <div className="absolute top-2 right-3 flex gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">New Release</span>
              </div>
            </motion.a>
          )}

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
              {/* 預設背景：極簡毛玻璃 */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md group-hover:opacity-0 transition-opacity duration-500"></div>
              
              {/* 懸停背景：漸層亮起 */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${link.color} transition-opacity duration-500`}></div>
              
              {/* 閃光流動效果 (僅在懸停時) */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              
              {/* 中心內容組合：確保 icon 和文字對齊 */}
              <div className="flex items-center justify-center gap-4 relative z-10 w-full">
                <motion.span 
                  className="w-6 flex justify-center text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300"
                >
                  {link.icon}
                </motion.span>
                <span className="text-white/80 group-hover:text-white font-light tracking-[0.15em] text-[15px] transition-colors duration-300">
                  {link.name}
                </span>
              </div>

              {/* 右側裝飾：絕對定位，不影響中心對齊 */}
              <div className="absolute right-6 z-10 text-white/20 group-hover:text-white/100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_10px_white]"></div>
              </div>

              {/* 特別標註 (如會員) */}
              {link.special && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-yellow-500/10 backdrop-blur-sm text-[9px] text-yellow-200/50 font-bold tracking-widest border-b border-l border-yellow-500/20 rounded-bl-xl group-hover:bg-yellow-400 group-hover:text-black group-hover:opacity-100 transition-all duration-500">
                  {link.price && <span className="mr-2 opacity-50 group-hover:opacity-100">{link.price}</span>}
                  VIP
                </div>
              )}
            </motion.a>
          ))}
        </div>

        {/* 頁尾微標 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 mb-32 flex flex-col items-center gap-4"
        >
          {/* ... 頁尾內容 ... */}
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

      {/* 隱藏的播放器引擎 */}
      {latestVideoId && (
        <div className="fixed top-0 -left-[1000px] pointer-events-none w-1 h-1 overflow-hidden">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${latestVideoId}`}
            playing={isPlaying}
            onReady={() => setIsPlayerReady(true)}
            onProgress={(state) => setPlayed(state.played)}
            onError={(e) => console.error("Player Error:", e)}
            config={{ 
              youtube: { 
                playerVars: { 
                  autoplay: 0,
                  controls: 0,
                  modestbranding: 1
                } 
              } 
            }}
          />
        </div>
      )}

      {/* 懸浮音樂控制面板 */}
      {latestVideoId && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[500px]"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-4 shadow-2xl">
            {/* 進度條 */}
            <div className="absolute top-0 left-0 h-[2px] bg-yellow-500/50 transition-all duration-300" style={{ width: `${played * 100}%` }}></div>
            
            <div className="flex items-center justify-between gap-4">
              {/* 歌曲資訊 */}
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[#800000] to-black flex items-center justify-center border border-white/10 ${isPlaying ? 'animate-pulse' : ''}`}>
                  <Music className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-tighter">Now Playing</span>
                  <span className="text-white/90 text-xs font-light tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
                    {latestVideoTitle || "Loading..."}
                  </span>
                </div>
              </div>

              {/* 控制按鈕 */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 relative"
                >
                  {/* 如果還沒 Ready 但也沒在播放，顯示微小的載入感，但允許點擊 */}
                  {!isPlayerReady && !isPlaying ? (
                    <>
                      <Play className="w-5 h-5 ml-0.5 opacity-40" />
                      <div className="absolute inset-0 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
                    </>
                  ) : (
                    isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                <div className="flex items-center gap-2 text-white/30 sm:flex hidden">
                  <Volume2 className="w-4 h-4" />
                  <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/40 w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
