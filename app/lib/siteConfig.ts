export type SiteConfig = {
  version: number;
  site: {
    title: string;
    description: string;
    bioLines: string[];
  };
  theme: {
    backgroundImage: string;
    logoTitleImage: string;
    footerLogoImage: string;
  };
  features: {
    enableWhispers: boolean;
    whispers: string[];
    enableCheerButton: boolean;
    cheerLabel: string;
    enableYouTubeLatest: boolean;
    enableYouTubePlayer: boolean;
    enableYouTubeShuffle: boolean;
  };
  youtube: {
    channelId: string;
    latestButtonLabel: string;
  };
  links: Array<{
    id: string;
    enabled: boolean;
    label: string;
    url: string;
    icon: "Youtube" | "Crown" | "Headphones" | "Music" | "AtSign" | "Image";
    gradient: string;
    badge?: string;
    badgeLeft?: string;
  }>;
  wallpapers: {
    enabled: boolean;
    title: string;
    note: string;
    localBase: string;
    remoteBaseUrl?: string;
    files: string[];
  };
};

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const res = await fetch("/site-config.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load site-config.json (${res.status})`);
  return (await res.json()) as SiteConfig;
}

