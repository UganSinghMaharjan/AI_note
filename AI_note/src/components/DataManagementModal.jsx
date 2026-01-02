import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaExclamationTriangle, FaTimes } from "react-icons/fa";

const DataManagementModal = ({ isOpen, onClose, onBulkDelete }) => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'prune' or 'clear'

  const handleActionTrigger = (type) => {
    setPendingAction(type);
  };

  const handleFinalConfirm = () => {
    if (pendingAction === "prune") {
      onBulkDelete(10);
    } else if (pendingAction === "clear") {
      onBulkDelete(null);
    }
    setPendingAction(null);
    setConfirmClearAll(false);
  };

  const handleCancelAction = () => {
    setPendingAction(null);
  };

  // Reset states when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setPendingAction(null);
      setConfirmClearAll(false);
    }
  }, [isOpen]);

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
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <FaTrash className="text-accent" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Data Management
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-xl text-text-muted hover:text-white transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {!pendingAction ? (
                  <motion.div
                    key="main-view"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-8 space-y-8"
                  >
                    {/* Option 1: Remove Last 10 */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-white/90">
                          Prune Data
                        </h3>
                        <p className="text-sm text-text-muted/60">
                          Quickly remove the oldest 10 notes from your library.
                        </p>
                      </div>
                      <button
                        onClick={() => handleActionTrigger("prune")}
                        className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 group underline-offset-4"
                      >
                        <span>Remove Oldest 10 Notes</span>
                      </button>
                    </div>

                    <div className="h-[1px] bg-white/5" />

                    {/* Option 2: Clear All */}
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-red-400">
                          Clear All Data
                        </h3>
                        <p className="text-sm text-text-muted/60">
                          Permanently delete all notes. This action is
                          irreversible.
                        </p>
                      </div>

                      <div
                        className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl group cursor-pointer"
                        onClick={() => setConfirmClearAll(!confirmClearAll)}
                      >
                        <input
                          type="checkbox"
                          checked={confirmClearAll}
                          onChange={(e) => setConfirmClearAll(e.target.checked)}
                          className="w-5 h-5 rounded border-red-500/30 bg-red-500/10 text-red-500 focus:ring-red-500/20"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-xs font-medium text-red-400/80 group-hover:text-red-400 transition-colors">
                          I understand that all my notes will be permanently
                          deleted.
                        </span>
                      </div>

                      <button
                        disabled={!confirmClearAll}
                        onClick={() => handleActionTrigger("clear")}
                        className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                          confirmClearAll
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:-translate-y-0.5"
                            : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                        }`}
                      >
                        <FaExclamationTriangle
                          className={confirmClearAll ? "animate-pulse" : ""}
                        />
                        <span>Wipe Everything</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirm-view"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-8 space-y-6 text-center"
                  >
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                      <FaExclamationTriangle className="text-red-500 text-2xl animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Final Confirmation
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed">
                        Are you absolutely sure? You are about to{" "}
                        <span className="text-red-400 font-bold">
                          {pendingAction === "prune"
                            ? "delete the 10 oldest notes"
                            : "permanently wipe all your data"}
                        </span>
                        . This cannot be undone.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <button
                        onClick={handleFinalConfirm}
                        className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-red-500/40 transition-all hover:-translate-y-0.5"
                      >
                        Yes, I'm Certain
                      </button>
                      <button
                        onClick={handleCancelAction}
                        className="w-full py-3 text-text-muted hover:text-white font-medium transition-colors"
                      >
                        Nevermind, Go Back
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/5 border-t border-white/5 text-center">
              <p className="text-[0.65rem] text-text-muted/40 uppercase tracking-widest font-bold">
                Advanced Data Controls
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DataManagementModal;
