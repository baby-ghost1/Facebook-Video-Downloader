import { create } from "zustand";

const HISTORY_KEY = "cliply_history";

const loadHistory = () => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useDownloadStore = create((set, get) => ({
  url: "",
  info: null,
  loading: false,
  downloadStage: null,
  downloadProgress: 0,
  platform: null,
  socketConnected: false,
  jobId: null,
  downloadQuality: null,
  downloadingQuality: null,
  history: loadHistory(),

  setUrl: (url) => set({ url }),
  setPlatform: (platform) => set({ platform }),
  setInfo: (info) => set({ info }),
  setLoading: (loading) => set({ loading }),
  setDownloadStage: (stage, progress = 0) =>
    set({ downloadStage: stage, downloadProgress: progress }),
  setSocketConnected: (socketConnected) => set({ socketConnected }),
  setJobId: (jobId) => set({ jobId }),
  setDownloadingQuality: (quality) => set({ downloadingQuality: quality }),

  reset: () => set({
    info: null,
    downloadStage: null,
    downloadProgress: 0,
    jobId: null,
    loading: false,
    downloadQuality: null,
    downloadingQuality: null,
  }),
  setDownloadQuality: (downloadQuality) => set({ downloadQuality }),

  addToHistory: (entry) => {
    const { history } = get();
    const updated = [
      { ...entry, id: Date.now(), timestamp: Date.now() },
      ...history.filter((h) => h.url !== entry.url),
    ].slice(0, 20);
    set({ history: updated });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  },

  clearHistory: () => {
    set({ history: [] });
    localStorage.removeItem(HISTORY_KEY);
  },
}));
