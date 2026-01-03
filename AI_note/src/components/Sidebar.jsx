import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaCog,
  FaUser,
  FaDatabase,
  FaSignOutAlt,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence, Reorder } from "framer-motion";

const Sidebar = ({
  notes,
  onSelectNote,
  onAddNote,
  onDeleteNote,
  onLogout,
  onOpenDataManagement,
  onOpenAbout,
  onOpenProfile,
  user,
  selectedNoteId,
  onReorder,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Safe check for notes array
  const safeNotes = Array.isArray(notes) ? notes : [];

  // Filter notes based on search query
  const filteredNotes = safeNotes.filter((note) => {
    const titleMatch = (note.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const contentMatch = (note.content || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || contentMatch;
  });

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handleDataManagementClick = () => {
    onOpenDataManagement();
    setIsSettingsOpen(false);
  };

  const handleAboutClick = () => {
    onOpenAbout();
    setIsSettingsOpen(false);
  };

  const handleProfileClick = () => {
    onOpenProfile();
    setIsSettingsOpen(false);
  };

  // Helper to determine if image is local or external
  const getProfilePicture = (picture) => {
    if (!picture) return "https://ui-avatars.com/api/?name=" + user.name;
    if (picture.startsWith("http")) return picture;
    return `http://localhost:5000${picture}`;
  };

  return (
    <aside className="w-[320px] h-full flex flex-col glass-panel relative z-10 transition-all duration-300">
      {/* ... header and notes ... */}
      <div className="p-6 pb-4">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent tracking-tight">
          AI Notes
        </h1>

        <button
          onClick={onAddNote}
          className="w-full py-3 px-4 bg-accent/90 hover:bg-accent text-[#1a1a1a] rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_theme(colors.accent-glow)] hover:shadow-[0_0_30px_theme(colors.accent-glow)] hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search - Placeholder for Smart Search */}
      <div className="px-6 pb-4">
        <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3 border border-white/5 focus-within:bg-white/10 focus-within:border-white/10 transition-all duration-300">
          <FaSearch className="text-text-muted/60 text-sm" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-text-muted/40 text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-text-muted/40 hover:text-white transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center gap-3 opacity-50">
            <span className="text-4xl">{searchQuery ? "🔍" : "📝"}</span>
            <p className="text-text-muted text-sm font-medium">
              {searchQuery ? "No matches found" : "No notes yet"}
            </p>
          </div>
        ) : searchQuery ? (
          /* Static List when searching to avoid reordering confusion */
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => onSelectNote(note)}
                className={`group p-4 rounded-xl cursor-pointer border relative overflow-hidden transition-colors duration-200 ${
                  selectedNoteId === note._id
                    ? "bg-white/10 border-accent/30 shadow-lg"
                    : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                {/* Active Indicator */}
                {selectedNoteId === note._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_10px_theme(colors.accent)]" />
                )}

                <div className="flex justify-between items-start gap-2">
                  <h3
                    className={`text-[0.95rem] font-semibold mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis transition-colors flex-1 ${
                      selectedNoteId === note._id
                        ? "text-white"
                        : "text-text-main/90 group-hover:text-white"
                    }`}
                  >
                    {note.title || "Untitled"}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-text-muted hover:text-red-400 transition-all duration-200"
                    title="Delete Note"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <p className="text-xs text-text-muted/70 whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  {note.content ? note.content.substring(0, 50) : "No content"}
                </p>
                <span className="text-[0.65rem] text-text-muted/40 mt-3 block font-mono tracking-wide">
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Reorderable List when not searching */
          <Reorder.Group
            axis="y"
            values={notes}
            onReorder={onReorder}
            className="space-y-2"
          >
            {notes.map((note) => (
              <Reorder.Item
                value={note}
                key={note._id}
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 50,
                  mass: 1,
                }}
                whileDrag={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                onClick={() => onSelectNote(note)}
                className={`group p-4 rounded-xl cursor-pointer border relative overflow-hidden transition-colors duration-200 ${
                  selectedNoteId === note._id
                    ? "bg-white/10 border-accent/30 shadow-lg"
                    : "bg-transparent border-transparent hover:bg-white/5"
                }`}
              >
                {/* Active Indicator */}
                {selectedNoteId === note._id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_10px_theme(colors.accent)]" />
                )}

                <div className="flex justify-between items-start gap-2">
                  <h3
                    className={`text-[0.95rem] font-semibold mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis transition-colors flex-1 ${
                      selectedNoteId === note._id
                        ? "text-white"
                        : "text-text-main/90 group-hover:text-white"
                    }`}
                  >
                    {note.title || "Untitled"}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-text-muted hover:text-red-400 transition-all duration-200"
                    title="Delete Note"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                <p className="text-xs text-text-muted/70 whitespace-nowrap overflow-hidden text-ellipsis font-medium">
                  {note.content ? note.content.substring(0, 50) : "No content"}
                </p>
                <span className="text-[0.65rem] text-text-muted/40 mt-3 block font-mono tracking-wide">
                  {new Date(note.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}
      </div>

      {/* User Session Footer */}
      {user && (
        <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md relative">
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-bg-surface/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 origin-bottom"
              >
                <div className="space-y-1">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-colors text-sm font-medium group"
                  >
                    <FaUser className="text-accent/70 group-hover:text-accent" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleDataManagementClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-colors text-sm font-medium group"
                  >
                    <FaDatabase className="text-accent/70 group-hover:text-accent" />
                    <span>Data Management</span>
                  </button>
                  <button
                    onClick={handleAboutClick}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-colors text-sm font-medium group"
                  >
                    <FaInfoCircle className="text-accent/70 group-hover:text-accent" />
                    <span>About</span>
                  </button>
                  <div className="h-[1px] bg-white/5 my-1 mx-2" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors text-sm font-medium group"
                  >
                    <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={getProfilePicture(user.picture)}
                alt={user.name}
                className="w-9 h-9 rounded-full border border-white/20 shadow-inner"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[0.65rem] text-text-muted/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={toggleSettings}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isSettingsOpen
                  ? "bg-accent text-[#1a1a1a] rotate-90 shadow-[0_0_15px_theme(colors.accent-glow)]"
                  : "text-text-muted hover:text-white hover:bg-white/10"
              }`}
              title="Settings"
            >
              <FaCog size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
