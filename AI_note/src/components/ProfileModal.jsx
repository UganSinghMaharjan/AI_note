import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaTimes,
  FaEnvelope,
  FaCalendarAlt,
  FaStickyNote,
  FaGoogle,
  FaCamera,
  FaCheckCircle,
} from "react-icons/fa";

const ProfileModal = ({
  isOpen,
  onClose,
  user,
  totalNotes,
  onUpdateProfile,
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!user) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        setShowSuccess(false);
        await onUpdateProfile(file);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Helper to determine if image is local or external
  const getProfilePicture = (picture) => {
    if (!picture) return "https://ui-avatars.com/api/?name=" + user.name;
    if (picture.startsWith("http")) return picture;
    return `http://localhost:5000${picture}?t=${new Date().getTime()}`;
  };

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
            className="relative w-full max-w-md bg-bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header / Banner */}
            <div className="h-24 bg-gradient-to-r from-accent/20 via-purple-500/10 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-all z-10"
            >
              <FaTimes size={18} />
            </button>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-12 text-center">
              <div className="relative inline-block">
                <div
                  className="relative group cursor-pointer"
                  onClick={handleImageClick}
                >
                  <img
                    src={getProfilePicture(user.picture)}
                    alt={user.name}
                    className={`w-24 h-24 rounded-full border-4 border-bg-surface shadow-2xl transition-all duration-300 ${
                      isUploading
                        ? "opacity-50 grayscale"
                        : "group-hover:brightness-75"
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {!isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaCamera className="text-white text-xl drop-shadow-lg" />
                    </div>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-accent/80 rounded-full backdrop-blur-sm z-20"
                      >
                        <FaCheckCircle className="text-white text-3xl mb-1 shadow-lg" />
                        <span className="text-[0.6rem] text-white font-bold uppercase tracking-wider">
                          Updated!
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <div className="absolute bottom-1 right-1 p-1.5 bg-accent rounded-full border-2 border-bg-surface shadow-lg">
                  <FaGoogle className="text-[10px] text-[#1a1a1a]" />
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1 text-text-muted/60 text-sm font-medium">
                  <FaEnvelope className="text-xs" />
                  <span>{user.email}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1 group hover:bg-white/10 transition-colors">
                  <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors">
                    <FaStickyNote className="text-accent" />
                  </div>
                  <span className="text-xl font-bold text-white mt-1">
                    {totalNotes}
                  </span>
                  <span className="text-[0.65rem] text-text-muted/40 uppercase font-bold tracking-widest">
                    Total Notes
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-1 group hover:bg-white/10 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <FaCalendarAlt className="text-blue-400" />
                  </div>
                  <span className="text-[0.65rem] text-white mt-1 font-bold">
                    Member Since
                  </span>
                  <span className="text-[0.65rem] text-text-muted/40 uppercase font-bold tracking-widest">
                    Jan 2026
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                className="w-full mt-8 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-text-muted hover:text-white text-sm font-medium transition-all duration-300"
                onClick={() =>
                  window.open("https://myaccount.google.com/", "_blank")
                }
              >
                Manage Google Account
              </button>
            </div>

            {/* Subtle Footer */}
            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
              <p className="text-[0.6rem] text-text-muted/30 uppercase tracking-[0.2em] font-bold">
                Account Status: Active
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
