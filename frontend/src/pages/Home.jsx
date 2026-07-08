import Layout from "../components/Layout";
import DownloadForm from "../home/DownloadForm";
import ResultCard from "../home/ResultCard";
import ProgressBar from "../home/ProgressBar";
import QualityList from "../home/QualityList";
import { useDownloader } from "../hooks/useDownloader";
import { AnimatePresence, motion } from "framer-motion";

const Home = () => {
  const {
    url, setUrl, info, loading, downloadStage, downloadProgress,
    platform, downloadingQuality, fetchMeta, download
  } = useDownloader();

  return (
    <Layout>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <DownloadForm
          url={url}
          setUrl={setUrl}
          loading={loading && !downloadingQuality}
          isDownloading={!!downloadingQuality}
          fetchMeta={fetchMeta}
          platform={platform}
        />

        <AnimatePresence mode="wait">
          {loading && !info && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4"
            >
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-44 animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                  <div className="flex-1 p-4 space-y-3">
                    <div className="h-5 w-3/4 rounded-lg animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="h-3 w-1/3 rounded-lg animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                    <div className="flex gap-3 mt-4">
                      <div className="h-3 w-16 rounded-lg animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                      <div className="h-3 w-24 rounded-lg animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="h-5 w-14 rounded-md animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                      <div className="h-5 w-14 rounded-md animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                      <div className="h-5 w-14 rounded-md animate-shimmer" style={{ background: "var(--bg-tertiary)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {info && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 space-y-4"
            >
              <ResultCard info={info} platform={platform} />
              <ProgressBar stage={downloadStage} percent={downloadProgress} />
              <QualityList
                qualities={info.qualities}
                loading={loading}
                download={download}
                platform={platform}
                downloadingQuality={downloadingQuality}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Home;
