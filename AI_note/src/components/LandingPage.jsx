import React from "react";
import { motion } from "framer-motion";
import {
  HiLightningBolt,
  HiShieldCheck,
  HiOutlineSparkles,
  HiArrowRight,
} from "react-icons/hi";

const LandingPage = ({ onGetStarted, darkMode }) => {
  const features = [
    {
      icon: <HiLightningBolt className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      description:
        "Quickly capture thoughts with our optimized editor and instant cloud sync.",
    },
    {
      icon: <HiShieldCheck className="w-6 h-6 text-green-400" />,
      title: "Secure by Design",
      description:
        "Your notes are encrypted and protected with industry-standard security.",
    },
    {
      icon: <HiOutlineSparkles className="w-6 h-6 text-purple-400" />,
      title: "AI-Powered",
      description:
        "Intelligent organization and smart suggestions to help you stay productive.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-bg-base text-text-primary overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide uppercase">
              Next-Gen Note Taking
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-gradient-to-r from-text-main via-text-main/90 to-text-main/60 bg-clip-text text-transparent">
              Organize your mind <br className="hidden md:block" /> with{" "}
              <span className="text-accent">AI Notes</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed">
              The beautiful, secure, and intelligent workspace for your
              thoughts, ideas, and documents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-accent hover:bg-accent-hover text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
              >
                Get Started for Free
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-5xl pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/4 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[120px]"
          />
        </div>
      </header>

      {/* Design Philosphy Section */}
      <section className="py-20 px-6 bg-bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold italic text-text-main">
                "Less friction, more flow."
              </h2>
              <p className="text-lg text-text-muted leading-relaxed">
                Our design philosophy is centered around minimalism and beauty.
                We believe that a clean workspace leads to a clear mind. Every
                pixel in AI Notes is carefully placed to provide a premium
                experience that wows you at first glance.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent" />
                  <p className="text-text-muted">
                    <span className="text-text-main font-medium">
                      Adaptive Theme:
                    </span>{" "}
                    Switch between Dark and Light mode for your comfort.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent" />
                  <p className="text-text-muted">
                    <span className="text-text-main font-medium">
                      Glassmorphism UI:
                    </span>{" "}
                    Modern, sleek, and translucent interfaces.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent" />
                  <p className="text-text-muted">
                    <span className="text-text-main font-medium">
                      Fluid Animations:
                    </span>{" "}
                    Interactions that feel alive and responsive.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-text-main/5 to-text-main/[0.02] border border-white/10 shadow-2xl"
            >
              <div className="aspect-video bg-bg-base/50 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                <span className="text-text-muted italic text-center">
                  Visualizing Premium <br /> {darkMode ? "Dark" : "Light"}{" "}
                  Design...
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">
            Crafted for Clarity
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Everything you need to capture, organize, and excel.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-bg-secondary border border-white/5 hover:border-accent/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-accent/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-xl font-bold italic">
            <span className="text-2xl">📝</span> AI Notes
          </div>
          <p className="text-text-muted text-sm">
            © 2026 AI Notes. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-text-muted">
            <a href="#" className="hover:text-accent">
              Terms
            </a>
            <a href="#" className="hover:text-accent">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
