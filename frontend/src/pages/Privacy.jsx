import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const items = [
  {
    icon: Shield,
    title: "No Data Storage",
    desc: "We don't store, track, or share any user data. All processing happens in real-time.",
  },
  {
    icon: Lock,
    title: "Ephemeral Processing",
    desc: "Downloaded files are temporarily processed and immediately deleted after delivery.",
  },
  {
    icon: Eye,
    title: "No Monitoring",
    desc: "We don't monitor, log, or inspect the URLs you paste or the videos you download.",
  },
  {
    icon: FileText,
    title: "User Responsibility",
    desc: "You are responsible for ensuring downloaded content complies with applicable laws and platform terms.",
  },
];

const Privacy = () => {
  return (
    <Layout>
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-black text-[var(--text-primary)]">Privacy & Usage</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Your privacy is our priority</p>
        </motion.div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl border"
                style={{ background: "var(--bg-secondary)", borderColor: "var(--card-border)" }}
              >
                <div
                  className="w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--info-light)", borderColor: "var(--card-border)" }}
                >
                  <Icon size={18} className="text-[var(--info)]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
