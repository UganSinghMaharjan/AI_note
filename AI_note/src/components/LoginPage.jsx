import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../services/user";
import { HiMail, HiLockClosed, HiUser, HiArrowLeft } from "react-icons/hi";

const LoginPage = ({ onLoginSuccess, onLoginError, onBack }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isSignUp) {
        response = await userService.register(formData);
      } else {
        response = await userService.login({
          email: formData.email,
          password: formData.password,
        });
      }
      onLoginSuccess(null, response); // Pass null for response.credential if it's manual login
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
      >
        <div className="p-8 md:p-12">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-8 flex items-center gap-2 text-text-muted hover:text-white transition-colors group"
            >
              <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          )}

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-text-muted mt-2">
              {isSignUp
                ? "Join AI Notes today"
                : "Log in to continue your journey"}
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-text-muted mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      type="text"
                      name="name"
                      required={isSignUp}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-accent/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent-hover disabled:bg-accent/50 text-white rounded-xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {isSignUp ? "Sign Up" : "Login"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-4 bg-bg-base text-text-muted text-sm uppercase tracking-widest font-semibold">
              Or continue with
            </span>
          </div>

          <div className="flex justify-center scale-110">
            <GoogleLogin
              onSuccess={(res) => onLoginSuccess(res)}
              onError={(error) => {
                console.error("Google Login Detailed Error:", error);
                onLoginError(error);
              }}
              useOneTap
              theme="filled_black"
              shape="pill"
            />
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-text-muted hover:text-white transition-colors"
            >
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <span className="text-accent font-semibold ml-1">Login</span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span className="text-accent font-semibold ml-1">
                    Create Account
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
