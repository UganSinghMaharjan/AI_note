import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Placeholder } from "@tiptap/extension-placeholder";

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
  FaCopy,
  FaCheck,
  FaPaste,
  FaRobot,
  FaRedo,
  FaUndo,
  FaStrikethrough,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import AIChatPanel from "./AIChatPanel";
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
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAISidebar, setShowAISidebar] = useState(false);

  // Tiptap Editor Setup
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      TextStyle,
      Color,
      Image,
      Link.configure({
        openOnClick: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: "Start typing...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      // Debounce update in parent effect, but here we just need to ensure we can capture it
      // Actually we'll use a separate effect to sync editor.getHTML() with 'content' state
      // but let's just trigger the update logic directly?
      // Better: Keep local content state mostly for initial load, but rely on editor for current value
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[calc(100vh-200px)] " +
          (darkMode ? "prose-invert" : "") +
          " prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl " +
          " prose-p:text-text-muted/80 " +
          " prose-a:text-accent prose-code:text-accent prose-code:bg-white/5 prose-code:px-1 prose-code:rounded " +
          " prose-pre:bg-bg-base prose-pre:border prose-pre:border-white/5",
      },
    },
  });

  // Sync Note Data to State & Editor
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setFolder(note.folder || "General");
      // Only set content if it's different to prevent cursor jumps or re-renders loops
      // Simple check: if editor is empty or note changed significantly
      if (editor && note.content !== editor.getHTML()) {
        // We need to be careful not to overwrite user typing with old data
        // Ideally checking if note ID changed is safest for full swap
        // For distinct notes:
        editor.commands.setContent(note.content || "");
      }
    }
  }, [note, editor]);

  // Debounce Save (triggered by changes in Editor or Title/Folder)
  useEffect(() => {
    if (!note || !editor) return;

    const currentContent = editor.getHTML();

    if (
      title === note.title &&
      currentContent === note.content &&
      folder === (note.folder || "General")
    ) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onUpdateNote({
        ...note,
        title,
        content: currentContent,
        folder,
      });
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [title, folder, editor?.state.doc.content.size]); // Depend on editor content size or similar to trigger

  // We need to validly track "content changed" for the effect above.
  // The simplest way with Tiptap + React Effect debounce is to force a re-render on edit
  // or use a ref. Let's make a manual update handler.
  const handleEditorUpdate = () => {
    if (!note || !editor) return;
    const currentContent = editor.getHTML();
    onUpdateNote({
      ...note,
      title,
      content: currentContent,
      folder,
    });
  };

  // Actually, let's stick to the previous pattern:
  // We need a local 'content' state that tracks editor updates?
  // No, Tiptap manages its own state. We just need to trigger the debounce.
  // Let's attach onUpdate to editor config above to update a trigger state.

  // Re-define editor with onUpdate to trigger a state change
  // Note: we can't easily change `useEditor` options dynamically without Remirror logic.
  // Instead, use `editor.on('update')` in a useEffect.

  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => {
      // This will trigger the debounce effect above if we track a revision counter
      // Or we can just do the debounced save here directly?
      // Let's do the debounce here directly to avoid complex state deps
    };

    // Actually, the simplest way is to just let the user type, and use a timer ref
    // to save after inactivity.

    let debounceTimer;

    const handleUpdate = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onUpdateNote({
          ...note, // Careful: this captured 'note' might be stale?
          // It is better to rely on refs or functional updates if available,
          // but here onUpdateNote expects the full object.
          // We should use the latest title/folder state.
          title: title, // This title is from closure, might be stale if title changed?
          // React `useEffect` runs once. `title` is stale.
          // We need this effect to re-run or use Refs for current state.
        });
      }, 1500);
    };

    // Re-thinking: The standard React pattern
    // The previous code had `[title, content, folder]` dependency array.
    // We can replicate that if we have a way to get 'content' out of editor.
    // Let's add `onUpdate` to `useEditor` that calls `setContent(editor.getHTML())`.
  }, [editor]); // This logic is getting messy.

  // LET'S GO BACK TO THE PROVEN PATTERN:
  // 1. `useEditor` with `onUpdate` that sets a local `content` state.
  // 2. `useEffect` on `[content]` debounces the save.

  const [content, setContent] = useState("");

  // Need to recreate editor if dependencies like onUpdate change? No.
  // We can't pass `setContent` to `useEditor` easily if we want it stable.
  // But wait, `useEditor` is stable.
  // Actually, we can just use `editor.on` in an effect.

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      setContent(editor.getHTML());
    };

    editor.on("update", onUpdate);

    return () => {
      editor.off("update", onUpdate);
    };
  }, [editor]);

  // Handle Title/Folder inputs
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleFolderChange = (e) => setFolder(e.target.value);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleCopyToClipboard = async () => {
    if (!editor) return;
    try {
      // Get text content for clipboard? Or HTML? usually text.
      // editor.getText() gives plain text.
      await navigator.clipboard.writeText(editor.getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePasteFromClipboard = async () => {
    // Tiptap handles paste natively perfectly fine.
    // But if we want a button:
    if (!editor) return;
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      editor.commands.insertContent(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      alert("Could not paste from clipboard. Please allow access.");
    }
  };

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

  // Toolbar Actions
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run();
  const toggleCode = () => editor?.chain().focus().toggleCode().run();
  const toggleHeading = (level) =>
    editor?.chain().focus().toggleHeading({ level }).run();
  const toggleBulletList = () =>
    editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();
  const toggleTaskList = () => editor?.chain().focus().toggleTaskList().run();
  const toggleBlockquote = () =>
    editor?.chain().focus().toggleBlockquote().run();

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
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

  const formatLastEdited = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000 && now.getDate() === date.getDate()) {
      return `Last edited at ${date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })}`;
    }

    return `Last edited ${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })}`;
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-base relative overflow-hidden">
        {/* ... (Same empty state as before) ... */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="absolute top-4 left-4 p-3 bg-bg-surface border border-white/10 rounded-xl text-text-muted hover:text-white shadow-lg transition-colors z-50"
            title="Open Sidebar"
          >
            <FaFolder size={18} />
          </button>
        )}

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
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-bg-surface border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden max-w-[95%] mx-auto w-full"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          {/* ... (Same header inputs as before) ... */}
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={onToggleSidebar}
                className="p-1.5 mr-2 bg-white/5 border border-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
                title="Open Sidebar"
              >
                <FaFolder size={14} />
              </button>
            )}
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
                <span>{formatLastEdited(note.updatedAt)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAISidebar(true)}
              className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
              title="Ask AI"
            >
              <FaRobot size={14} />
            </button>
            <button
              onClick={handlePasteFromClipboard}
              className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
              title="Paste from Clipboard"
            >
              <FaPaste size={14} />
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
              title="Copy Text to Clipboard"
            >
              {copied ? (
                <FaCheck size={14} className="text-green-400" />
              ) : (
                <FaCopy size={14} />
              )}
            </button>
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

        {/* Toolbar */}
        <div className="px-6 py-2 flex items-center gap-1 border-y border-white/5 bg-bg-base/50 relative z-20 flex-wrap">
          <button
            onClick={toggleBold}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("bold") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Bold"
          >
            <FaBold size={12} />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("italic") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Italic"
          >
            <FaItalic size={12} />
          </button>
          <button
            onClick={toggleStrike}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("strike") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Strikethrough"
          >
            <FaStrikethrough size={12} />
          </button>
          <button
            onClick={() => toggleHeading(1)}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("heading", { level: 1 }) ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Heading 1"
          >
            <FaHeading size={12} />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-2" />

          <button
            onClick={toggleCode}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("code") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Code"
          >
            <FaCode size={12} />
          </button>
          <button
            onClick={toggleBlockquote}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("blockquote") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Quote"
          >
            <FaQuoteRight size={12} />
          </button>
          <button
            onClick={toggleBulletList}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("bulletList") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Bullet List"
          >
            <FaListUl size={12} />
          </button>
          {/* Note: TaskList requires extra CSS usually, but we'll try it */}
          <button
            onClick={toggleTaskList}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("taskList") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Check List"
          >
            <FaCheckSquare size={12} />
          </button>

          <div className="w-[1px] h-4 bg-white/10 mx-2" />

          <button
            onClick={setLink}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("link") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Link"
          >
            <FaLink size={12} />
          </button>
          <button
            onClick={addImage}
            className={`p-1.5 rounded transition-colors ${editor?.isActive("image") ? "bg-white/20 text-white" : "hover:bg-white/10 text-text-muted hover:text-white"}`}
            title="Image"
          >
            <FaImage size={12} />
          </button>

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
                    "#000000",
                    "#ffffff",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => setColor(color)}
                      className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1" />
          <div className="flex gap-1 text-xs text-text-muted/40 font-mono hidden md:flex">
            <span>Markdown shortcuts enabled</span>
          </div>
        </div>

        {/* Tiptap Editor Content */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <div
            className="absolute inset-0 overflow-y-auto p-6 custom-scrollbar"
            onClick={() => editor?.commands.focus()}
          >
            <EditorContent editor={editor} />
          </div>

          <AnimatePresence>
            {showAISidebar && (
              <AIChatPanel
                isOpen={showAISidebar}
                onClose={() => setShowAISidebar(false)}
                noteContext={{
                  title,
                  content: editor?.getHTML() || "",
                  folder,
                  attachments: note.attachments || [],
                }}
              />
            )}
          </AnimatePresence>
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

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>
    </main>
  );
};

export default Editor;
