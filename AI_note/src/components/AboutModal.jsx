import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaInfoCircle,
  FaTimes,
  FaRocket,
  FaMagic,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";

const AboutModal = ({ isOpen, onClose }) => {
  const features = [
    {
      icon: <FaMagic className="text-purple-400" />,
      title: "Intelligent Writing",
      description:
        "Markdown-powered editor with real-time formatting and clean visual hierarchy.",
    },
    {
      icon: <FaShieldAlt className="text-blue-400" />,
      title: "Secure Auth",
      description:
        "Protected by Google OAuth 2.0 ensuring your notes are always private and accessible.",
    },
    {
      icon: <FaRocket className="text-orange-400" />,
      title: "Cloud Sync",
      description:
        "Instant saving and synchronization across all your sessions and devices.",
    },
  ];

  const roadmap = [
    "AI-powered note summarization and key-point extraction",
    "Smart tagging and categorization using NLP",
    "Voice-to-note transcription for hands-free capturing",
    "Collaborative workspaces for team productivity",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <FaInfoCircle className="text-accent" />
                </div>
                <h2 className="text-xl font-bold text-white">About AI Notes</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                  <FaCode className="text-xs" /> Core Capabilities
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start"
                    >
                      <div className="p-2.5 rounded-xl bg-white/5 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-text-muted/70 leading-relaxed font-medium">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                  <FaRocket className="text-xs" /> Future Updates
                </h3>
                <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6">
                  <ul className="space-y-3">
                    {roadmap.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shadow-[0_0_8px_theme(colors.accent)]" />
                        <span className="text-xs text-text-muted font-medium italic">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 text-center">
              <div className="flex flex-col gap-1 items-center">
                <p className="text-[0.7rem] text-text-muted/40 font-bold uppercase tracking-tighter">
                  Crafted for focus & clarity
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-8 h-[1px] bg-white/10" />
                  <span className="text-[0.6rem] text-accent/60 font-mono">
                    v1.2.0-Alpha
                  </span>
                  <span className="w-8 h-[1px] bg-white/10" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AboutModal;
