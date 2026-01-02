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

const Editor = ({
  note,
  onUpdateNote,
  saveStatus,
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Debounce changes
  useEffect(() => {
    if (!note) return;
    if (title === note.title && content === note.content) return;

    const timeoutId = setTimeout(() => {
      onUpdateNote({ ...note, title, content });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [title, content]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

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

  if (!note)
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-40 select-none">
        <div className="text-8xl mb-8 animate-pulse text-white/5">📝</div>
        <h2 className="text-2xl font-semibold text-text-muted">
          Select or create a note
        </h2>
      </div>
    );

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
      <div className="px-12 pb-4 pt-10 flex justify-between items-center group">
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
          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-text-muted/90 prose-a:text-accent prose-code:text-accent prose-pre:bg-bg-surface prose-pre:border prose-pre:border-white/5">
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
                  <p className="text-sm font-semibold text-white truncate leading-tight">
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
