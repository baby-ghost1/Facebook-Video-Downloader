const PLATFORM_PATTERNS = {
  facebook: [/facebook\.com/i, /fb\.watch/i],
  instagram: [/instagram\.com/i],
  youtube: [/youtube\.com/i, /youtu\.be/i, /yt\.be/i],
  x: [/twitter\.com/i, /x\.com/i],
  tiktok: [/tiktok\.com/i, /vm\.tiktok\.com/i],
  reddit: [/reddit\.com/i, /redd\.it/i, /v\.redd\.it/i],
  pinterest: [/pinterest\.com/i, /pin\.it/i],
  vimeo: [/vimeo\.com/i, /player\.vimeo\.com/i],
  dailymotion: [/dailymotion\.com/i, /dai\.ly/i],
  threads: [/threads\.net/i],
  twitch: [/twitch\.tv/i, /clips\.twitch\.tv/i],
  rumble: [/rumble\.com/i],
  bilibili: [/bilibili\.com/i, /b23\.tv/i],
  streamable: [/streamable\.com/i],
  facebook_reels: [/facebook\.com\/reels/i],
};

export const detectPlatform = (url = "") => {
  const value = url.trim().toLowerCase();
  for (const [platform, patterns] of Object.entries(PLATFORM_PATTERNS)) {
    if (patterns.some((regex) => regex.test(value))) {
      return platform;
    }
  }
  return null;
};

export const isValidVideoUrl = (url) => {
  if (!url) return false;
  const trimmed = url.trim();
  return /^https?:\/\/.+/i.test(trimmed);
};
