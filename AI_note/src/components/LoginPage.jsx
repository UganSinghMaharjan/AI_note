import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

const LoginPage = ({ onLoginSuccess, onLoginError }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-bg-base overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -70, 0],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 glass-panel rounded-3xl border border-white/10 flex flex-col items-center text-center shadow-2xl"
      >
        <div className="mb-8 p-5 bg-accent/10 rounded-2xl border border-accent/20">
          <span className="text-6xl">📝</span>
        </div>

        <h1 className="text-4xl font-bold mb-3 tracking-tight text-white bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          AI Notes
        </h1>
        <p className="text-text-muted/70 mb-10 text-lg font-medium leading-relaxed">
          Your thoughts, organized beautifully <br /> and secured with AI.
        </p>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

          <div className="scale-110 hover:scale-115 transition-transform duration-300">
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onError={(error) => {
                console.error("Google Login Detailed Error:", error);
                onLoginError(error);
              }}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>

          <p className="text-[0.7rem] text-text-muted/40 uppercase tracking-widest mt-4 font-semibold">
            SECURE ACCESS BY GOOGLE
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
