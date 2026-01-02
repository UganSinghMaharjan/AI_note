import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const Editor = ({ note, onUpdateNote, saveStatus }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // Debounce changes
  useEffect(() => {
    if (!note) return;

    // Only trigger if title or content changed from the current note
    if (title === note.title && content === note.content) return;

    const timeoutId = setTimeout(() => {
      onUpdateNote({ ...note, title, content });
    }, 1500); // 1.5s delay after typing stops

    return () => clearTimeout(timeoutId);
  }, [title, content]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

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
    <main className="flex-1 flex flex-col h-full relative">
      {/* Save Status Indicator */}
      <div className="absolute top-8 right-12 z-20 pointer-events-none">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 border
          ${
            saveStatus === "saving"
              ? "opacity-100 translate-y-0"
              : saveStatus === "saved"
              ? "opacity-100 translate-y-0 bg-success/10 border-success/20"
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
              <div className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_8px_theme(colors.success)]" />
              <span className="text-[0.65rem] font-bold text-success uppercase tracking-widest">
                Saved
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Editor Header */}
      <div className="px-12 pb-4 pt-10">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-5xl font-bold w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-muted/20 tracking-tight"
        />
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex px-12 pb-12 gap-12 overflow-hidden items-stretch">
        {/* Input Area */}
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing in Markdown..."
          className="flex-1 bg-transparent border-none resize-none outline-none text-lg leading-relaxed text-text-main/90 font-mono h-full placeholder:text-text-muted/30 focus:placeholder:text-text-muted/50 transition-colors"
        />

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto pl-12 border-l border-white/5 markdown-preview scroll-smooth">
          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-text-muted/90 prose-a:text-accent prose-code:text-accent prose-pre:bg-bg-surface prose-pre:border prose-pre:border-white/5">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </main>
  );
};

export default Editor;
