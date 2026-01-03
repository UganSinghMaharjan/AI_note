import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import {
  FaPaperclip,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaFile,
  FaDownload,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSparkles,
  HiOutlinePencilAlt,
  HiOutlineLightningBolt,
} from "react-icons/hi";

const Editor = ({
  note,
  onUpdateNote,
  saveStatus,
  onAddAttachment,
  onRemoveAttachment,
  darkMode,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [folder, setFolder] = useState("");
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setFolder(note.folder || "General");
    }
  }, [note]);

  // Debounce changes
  useEffect(() => {
    if (!note) return;
    if (
      title === note.title &&
      content === note.content &&
      folder === (note.folder || "General")
    )
      return;

    const timeoutId = setTimeout(() => {
      onUpdateNote({ ...note, title, content, folder });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [title, content, folder]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleFolderChange = (e) => setFolder(e.target.value);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && note) {
      try {
        setIsUploading(true);
        await onAddAttachment(note._id, file);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="text-red-400" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="text-orange-400" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-400" />;
      default:
        return <FaFile className="text-gray-400" />;
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (!note) {
    const tips = [
      "Use Markdown for better organization.",
      "Stay focused, stay productive.",
      "Your ideas deserve to be captured.",
      "A clear mind leads to clear notes.",
      "Organize your thoughts, change the world.",
    ];
    const randomTip = tips[Math.floor(Date.now() / 86400000) % tips.length];

    return (
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden bg-bg-base">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: darkMode ? [0.1, 0.2, 0.1] : [0.05, 0.12, 0.05],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: darkMode ? [0.05, 0.15, 0.05] : [0.03, 0.08, 0.03],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          <div className="relative mb-12">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className={`text-9xl filter ${
                darkMode
                  ? "drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                  : "drop-shadow-[0_0_30px_rgba(0,0,0,0.05)]"
              }`}
            >
              📝
            </motion.div>

            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-10 h-10 bg-accent/20 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center text-accent shadow-lg"
            >
              <HiOutlineSparkles size={20} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-2 -left-6 w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-text-muted/40 shadow-xl"
            >
              <HiOutlinePencilAlt size={24} />
            </motion.div>
          </div>

          <h2 className="text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-text-main via-text-main to-text-main/40 bg-clip-text text-transparent italic">
            Your Creative Space
          </h2>
          <p className="text-xl text-text-muted/60 max-w-sm mb-12 font-medium leading-relaxed">
            Select a note to start editing or create a new one to capture your
            next big idea.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="py-3 px-6 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-sm flex items-center gap-3 group hover:border-accent/30 transition-colors"
          >
            <HiOutlineLightningBolt className="text-accent/50 group-hover:text-accent transition-colors" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted/40 group-hover:text-text-muted/60 transition-colors">
              Tip: {randomTip}
            </span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Save Status Indicator */}
      <div className="absolute top-8 right-12 z-20 pointer-events-none">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 border
          ${
            saveStatus === "saving"
              ? "opacity-100 translate-y-0"
              : saveStatus === "saved"
              ? "opacity-100 translate-y-0 bg-white/5 border-white/10"
              : "opacity-0 translate-y-2"
          }
          glass-panel bg-white/5 border-white/10`}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_theme(colors.accent)]" />
              <span className="text-[0.65rem] font-bold text-text-muted/80 uppercase tracking-widest">
                Saving...
              </span>
            </>
          ) : saveStatus === "saved" ? (
            <>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_theme(colors.success)]" />
              <span className="text-[0.65rem] font-bold text-green-500 uppercase tracking-widest">
                Saved
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Editor Header */}
      <div className="px-12 pb-4 pt-10 flex flex-col gap-4 group">
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Note Title"
            className="text-5xl font-bold flex-1 bg-transparent border-none outline-none text-text-main placeholder:text-text-muted/20 tracking-tight"
          />
          <button
            onClick={handleFileClick}
            disabled={isUploading}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-text-muted hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm"
          >
            {isUploading ? (
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaPaperclip className="text-accent/70" />
            )}
            <span className="text-sm font-semibold">Attach</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 transition-all duration-300 hover:bg-white/10">
            <span className="text-[10px] font-bold text-text-muted/40 uppercase tracking-widest">
              Folder
            </span>
            <input
              type="text"
              value={folder}
              onChange={handleFolderChange}
              placeholder="General"
              className="bg-transparent border-none outline-none text-xs font-semibold text-accent/80 min-w-[100px] w-auto placeholder:text-text-muted/20"
            />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex px-12 pb-6 gap-12 overflow-hidden items-stretch">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing in Markdown..."
          className="flex-1 bg-transparent border-none resize-none outline-none text-lg leading-relaxed text-text-main/90 font-mono h-full placeholder:text-text-muted/30 focus:placeholder:text-text-muted/50 transition-colors"
        />
        <div className="flex-1 overflow-y-auto pl-12 border-l border-white/5 markdown-preview scroll-smooth">
          <article
            className={`prose ${
              darkMode ? "prose-invert" : ""
            } prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-text-muted/90 prose-a:text-accent prose-code:text-accent prose-pre:bg-bg-surface prose-pre:border prose-pre:border-white/5`}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </div>

      {/* Attachments Section */}
      {note.attachments && note.attachments.length > 0 && (
        <div className="px-12 pb-8 pt-4 border-t border-white/5 bg-white/[0.02]">
          <h3 className="text-xs font-bold text-text-muted/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <FaPaperclip className="text-[10px]" />
            Attachments ({note.attachments.length})
          </h3>
          <div className="flex flex-wrap gap-4">
            {note.attachments.map((file) => (
              <div
                key={file._id}
                className="group flex items-center bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-3 pr-4 rounded-xl transition-all duration-300 gap-3 min-w-[200px]"
              >
                <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                  {getFileIcon(file.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-main truncate leading-tight">
                    {file.name}
                  </p>
                  <p className="text-[0.65rem] text-text-muted/40 font-bold uppercase tracking-tighter">
                    {formatSize(file.size)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() =>
                      window.open(`http://localhost:5000${file.url}`, "_blank")
                    }
                    className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-accent transition-colors"
                  >
                    <FaDownload size={14} />
                  </button>
                  <button
                    onClick={() => onRemoveAttachment(note._id, file._id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Editor;
