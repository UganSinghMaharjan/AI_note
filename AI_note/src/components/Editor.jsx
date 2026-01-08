import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  FaPaperclip,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
  FaFile,
  FaDownload,
  FaTimes,
  FaFolder,
  FaBold,
  FaItalic,
  FaCode,
  FaLink,
  FaListUl,
  FaCheckSquare,
  FaQuoteRight,
  FaHeading,
  FaImage,
  FaPalette,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlinePencilAlt,
  HiOutlineSave,
  HiOutlineDocumentText,
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);
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

  const insertMarkdown = (prefix, suffix = "") => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    setContent(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const insertColor = (color) => {
    insertMarkdown(`<span style="color: ${color}">`, "</span>");
    setShowColorPicker(false);
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-base relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
        <div className="text-center space-y-4 z-10 p-8 glass-panel rounded-3xl border border-white/5 shadow-2xl">
          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
            <HiOutlineDocumentText className="text-4xl text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-text-main">
            No Note Selected
          </h2>
          <p className="text-text-muted max-w-sm">
            Select a note from the sidebar or verify your creativity by creating
            a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full bg-bg-base relative overflow-hidden p-4 md:p-8">
      {/* Background Noise/Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

      {/* The "Sheet" / Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-bg-surface border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden max-w-[95%] mx-auto w-full"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          {/* Meta Inputs */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-base rounded-md border border-white/5 hover:border-accent/30 transition-colors group">
              <FaFolder className="text-text-muted/50 group-hover:text-accent transition-colors text-xs" />
              <input
                type="text"
                value={folder}
                onChange={handleFolderChange}
                className="bg-transparent border-none outline-none text-xs font-semibold text-text-main w-[100px] placeholder:text-text-muted/30"
                placeholder="Folder"
              />
            </div>

            <div className="h-4 w-[1px] bg-white/10"></div>

            <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
              {saveStatus === "saving" ? (
                <span className="flex items-center gap-1 text-accent animate-pulse">
                  <HiOutlineSave /> Saving...
                </span>
              ) : saveStatus === "saved" ? (
                <span className="flex items-center gap-1 text-green-500">
                  <FaCheckSquare className="text-[10px]" /> Saved
                </span>
              ) : (
                <span>Last edited just now</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleFileClick}
              disabled={isUploading}
              className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
              title="Attach File"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaPaperclip size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Title Area */}
        <div className="px-6 pt-8 pb-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
            className="w-full bg-transparent border-none outline-none text-4xl font-bold text-text-main placeholder:text-text-muted/20"
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="px-6 py-2 flex items-center gap-1 border-y border-white/5 bg-bg-base/50 relative z-20">
          {[
            {
              icon: FaBold,
              action: () => insertMarkdown("**", "**"),
              title: "Bold",
            },
            {
              icon: FaItalic,
              action: () => insertMarkdown("*", "*"),
              title: "Italic",
            },
            {
              icon: FaHeading,
              action: () => insertMarkdown("# ", ""),
              title: "Heading",
            },
            { divider: true },
            {
              icon: FaCode,
              action: () => insertMarkdown("`", "`"),
              title: "Code",
            },
            {
              icon: FaQuoteRight,
              action: () => insertMarkdown("> ", ""),
              title: "Quote",
            },
            {
              icon: FaListUl,
              action: () => insertMarkdown("- ", ""),
              title: "List",
            },
            {
              icon: FaCheckSquare,
              action: () => insertMarkdown("- [ ] ", ""),
              title: "Checkbox",
            },
            { divider: true },
            {
              icon: FaLink,
              action: () => insertMarkdown("[", "](url)"),
              title: "Link",
            },
            {
              icon: FaImage,
              action: () => insertMarkdown("![alt](", ")"),
              title: "Image",
            },
          ].map((item, i) =>
            item.divider ? (
              <div key={i} className="w-[1px] h-4 bg-white/10 mx-2" />
            ) : (
              <button
                key={i}
                onClick={item.action}
                className="p-1.5 hover:bg-white/10 rounded text-text-muted hover:text-white transition-colors"
                title={item.title}
              >
                <item.icon size={12} />
              </button>
            )
          )}
          <div className="w-[1px] h-4 bg-white/10 mx-2" />
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-1.5 hover:bg-white/10 rounded transition-colors ${
                showColorPicker
                  ? "bg-white/10 text-accent"
                  : "text-text-muted hover:text-white"
              }`}
              title="Text Color"
            >
              <FaPalette size={12} />
            </button>
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 mt-2 p-2 bg-bg-surface border border-white/10 rounded-xl shadow-xl flex gap-2 w-max z-50"
                >
                  {[
                    "#ff5555",
                    "#ffb86c",
                    "#f1fa8c",
                    "#50fa7b",
                    "#8be9fd",
                    "#bd93f9",
                    "#ff79c6",
                    "#f8f8f2",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => insertColor(color)}
                      className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Editor Input */}
          <div className="flex-1 relative border-r border-white/5 bg-bg-base/20">
            <textarea
              ref={textAreaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Type your markdown here..."
              className="absolute inset-0 w-full h-full p-6 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-text-main/90 placeholder:text-text-muted/20 custom-scrollbar"
              spellCheck="false"
            />
          </div>

          {/* Preview Output */}
          <div className="flex-1 relative bg-bg-surface">
            <div className="absolute inset-0 w-full h-full p-6 overflow-y-auto custom-scrollbar">
              <article
                className={`prose ${
                  darkMode ? "prose-invert" : ""
                } prose-sm max-w-none
                    prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl
                    prose-p:text-text-muted/80
                    prose-a:text-accent prose-code:text-accent prose-code:bg-white/5 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-bg-base prose-pre:border prose-pre:border-white/5`}
              >
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </div>

        {/* Footer / Attachments */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 bg-bg-base/30 flex items-center gap-3 overflow-x-auto custom-scrollbar">
            {note.attachments.map((file) => (
              <div
                key={file._id}
                className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-white/10 rounded-md shadow-sm shrink-0 group"
              >
                <span className="text-text-muted/70">
                  {getFileIcon(file.name)}
                </span>
                <span className="text-xs font-medium text-text-main truncate max-w-[100px]">
                  {file.name}
                </span>
                <span className="text-[10px] text-text-muted/50 uppercase">
                  {formatSize(file.size)}
                </span>
                <button
                  onClick={() => onRemoveAttachment(note._id, file._id)}
                  className="ml-2 hover:text-red-400 text-text-muted transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
};

export default Editor;
