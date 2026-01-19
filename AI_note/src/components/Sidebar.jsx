import React, { useState, useRef } from "react";
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
  FaCopy,
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
  folders = ["General"],
  onAddFolder,
  onDeleteFolder,
  onUpdateNote,
  darkMode,
  onToggleDarkMode,
  onClose,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const hoverTimeout = useRef(null);

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
  const [collapsedFolders, setCollapsedFolders] = useState({});

  const toggleFolder = (folderName) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const handleAddFolderSubmit = async (e) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      await onAddFolder(newFolderName.trim());
      setNewFolderName("");
      setIsAddingFolder(false);
    }
  };

  const handeNoteReorder = (folderName, reorderedNotesInFolder) => {
    const otherNotes = notes.filter(
      (n) => (n.folder || "General") !== folderName,
    );
    onReorder([...reorderedNotesInFolder, ...otherNotes]);
  };

  const handleDrag = (e, info) => {
    const elements = document.elementsFromPoint(info.point.x, info.point.y);
    const folderBox = elements.find((el) => el.hasAttribute("data-folder"));
    const folderName = folderBox?.getAttribute("data-folder");

    if (folderName !== draggedOverFolder) {
      setDraggedOverFolder(folderName || null);

      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

      if (folderName && collapsedFolders[folderName]) {
        hoverTimeout.current = setTimeout(() => {
          setCollapsedFolders((prev) => ({ ...prev, [folderName]: false }));
        }, 800);
      }
    }
  };

  const handleDragEnd = (note, info) => {
    setDraggedOverFolder(null);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);

    const elements = document.elementsFromPoint(info.point.x, info.point.y);
    const folderBox = elements.find((el) => el.hasAttribute("data-folder"));
    if (folderBox) {
      const targetFolder = folderBox.getAttribute("data-folder");
      if (targetFolder && targetFolder !== (note.folder || "General")) {
        onUpdateNote({ ...note, folder: targetFolder });
      }
    }
  };

  // Group notes by folder, ensuring all explicit folders AND folders used by notes are represented
  const allFolderNames = Array.from(
    new Set([...folders, ...(notes || []).map((n) => n.folder || "General")]),
  ).sort((a, b) => {
    if (a === "General") return -1;
    if (b === "General") return 1;
    return a.localeCompare(b);
  });

  const groupedNotes = allFolderNames.reduce((groups, folder) => {
    groups[folder] = (notes || []).filter(
      (n) => (n.folder || "General") === folder,
    );
    return groups;
  }, {});

  const displayFolders = allFolderNames.filter(
    (f) =>
      f.toLowerCase().includes(searchQuery.toLowerCase()) ||
      groupedNotes[f]?.some(
        (n) =>
          (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.content || "").toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

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
    return `${picture}?t=${new Date().getTime()}`;
  };

  const getFilteredNotes = (folder) => {
    const notesInFolder = groupedNotes[folder] || [];
    if (!searchQuery) return notesInFolder;

    return notesInFolder.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.content || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  return (
    <aside className="w-[320px] h-full flex flex-col glass-panel relative z-10 transition-all duration-300">
      {/* ... header and notes ... */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent tracking-tight">
            AI Notes
          </h1>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Collapse Sidebar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => onAddNote("General")}
            className="w-full py-3 px-4 bg-accent/90 hover:bg-accent text-[#1a1a1a] rounded-xl font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_theme(colors.accent-glow)] hover:shadow-[0_0_30px_theme(colors.accent-glow)] hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <FaPlus className="text-sm group-hover:rotate-90 transition-transform duration-300" />
            <span>New Note</span>
          </button>

          <button
            onClick={() => setIsAddingFolder(true)}
            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium flex items-center justify-center gap-2 border border-white/5 hover:border-white/10 transition-all duration-300"
          >
            <FaPlus className="text-xs opacity-50" />
            <span className="text-sm">New Group</span>
          </button>
        </div>
      </div>

      {/* Search */}
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
              className="text-text-muted/40 hover:text-text-main transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Folder Creation Input */}
      <AnimatePresence>
        {isAddingFolder && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-6 pb-4 overflow-hidden"
          >
            <form onSubmit={handleAddFolderSubmit} className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => !newFolderName && setIsAddingFolder(false)}
                className="w-full bg-white/5 border border-accent/30 rounded-xl p-2.5 pl-3 pr-10 text-sm outline-none placeholder:text-text-muted/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-accent text-[#1a1a1a] rounded-lg hover:scale-110 transition-transform"
              >
                <FaPlus className="text-[10px]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List by Group */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {displayFolders.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center gap-3 opacity-50">
            <span className="text-4xl">{searchQuery ? "🔍" : "📝"}</span>
            <p className="text-text-muted text-sm font-medium">
              {searchQuery ? "No matches found" : "No folders or notes yet"}
            </p>
          </div>
        ) : (
          displayFolders.map((folder) => (
            <motion.div
              key={folder}
              layout
              data-folder={folder}
              animate={{
                backgroundColor:
                  draggedOverFolder === folder
                    ? "var(--accent-glow)"
                    : "rgba(0, 0, 0, 0)",
                borderColor:
                  draggedOverFolder === folder
                    ? "var(--accent)"
                    : "rgba(0, 0, 0, 0)",
                scale: draggedOverFolder === folder ? 1.01 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="mb-4 rounded-2xl border"
            >
              <div className="group flex items-center justify-between pr-2">
                <button
                  onClick={() => toggleFolder(folder)}
                  className="flex-1 flex items-center gap-2 px-2 py-2 text-xs font-bold text-text-muted/40 uppercase tracking-[0.2em] hover:text-text-muted/60 transition-colors"
                >
                  <motion.span
                    animate={{ rotate: collapsedFolders[folder] ? -90 : 0 }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                  >
                    ▼
                  </motion.span>
                  {folder}
                  <span className="bg-white/5 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    {groupedNotes[folder]?.length || 0}
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddNote(folder);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-accent transition-all duration-200"
                    title="Add Note to Group"
                  >
                    <FaPlus size={10} />
                  </button>

                  {folder !== "General" && (
                    <button
                      onClick={() => onDeleteFolder(folder)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-red-400 transition-all duration-200"
                      title="Delete Group"
                    >
                      <FaTimes size={10} />
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!collapsedFolders[folder] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                    className="overflow-hidden"
                  >
                    <Reorder.Group
                      axis="y"
                      layout
                      values={getFilteredNotes(folder)}
                      onReorder={(newOrder) =>
                        handeNoteReorder(folder, newOrder)
                      }
                      className="space-y-2 py-1 px-1.5"
                    >
                      {getFilteredNotes(folder).length === 0 ? (
                        <div className="mx-2 mb-2 py-4 border border-dashed border-white/5 rounded-xl text-[10px] text-text-muted/15 text-center uppercase tracking-[0.2em] font-medium">
                          {searchQuery ? "No matches in group" : "Empty Group"}
                        </div>
                      ) : (
                        getFilteredNotes(folder).map((note) => (
                          <Reorder.Item
                            value={note}
                            key={note._id}
                            layout
                            layoutId={note._id}
                            dragListener={true}
                            dragControls={undefined}
                            onDrag={(e, info) => handleDrag(e, info)}
                            onDragEnd={(e, info) => handleDragEnd(note, info)}
                            transition={{
                              layout: {
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 1,
                              },
                              opacity: { duration: 0.2 },
                            }}
                            whileDrag={{
                              scale: 1.02,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              borderColor: "var(--accent)",
                              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
                              zIndex: 50,
                              cursor: "grabbing",
                            }}
                            whileHover={{
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                            }}
                            onClick={() => onSelectNote(note)}
                            className={`group p-4 rounded-xl cursor-grab border relative overflow-hidden transition-colors duration-200 select-none ${
                              selectedNoteId === note._id
                                ? "bg-white/10 border-accent/40 shadow-lg"
                                : "bg-transparent border-transparent"
                            }`}
                          >
                            {/* Active Indicator */}
                            {selectedNoteId === note._id && (
                              <motion.div
                                layoutId="activeNoteIndicator"
                                className="absolute left-0 top-0 bottom-0 w-1 bg-accent shadow-[0_0_15px_theme(colors.accent)]"
                              />
                            )}

                            <div className="flex justify-between items-start gap-2">
                              <h3
                                className={`text-[0.95rem] font-semibold mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis flex-1 ${
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
                              {note.content
                                ? note.content.substring(0, 50)
                                : "No content"}
                            </p>
                            <span className="text-[0.65rem] text-text-muted/40 mt-3 block font-mono tracking-wide">
                              {new Date(note.updatedAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </Reorder.Item>
                        ))
                      )}
                    </Reorder.Group>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
      {/* Settings/Profile Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between gap-4 bg-white/[0.02]">
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-300"
        >
          <div className="relative">
            <img
              src={getProfilePicture(user.picture)}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-white/10 group-hover:border-accent/50 transition-colors shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a0a] rounded-full" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
              {user.name}
            </p>
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
              Pro Account
            </p>
          </div>
        </button>

        <div className="flex gap-1">
          <button
            onClick={toggleSettings}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              isSettingsOpen
                ? "bg-accent text-[#1a1a1a] shadow-[0_0_15px_theme(colors.accent-glow)]"
                : "text-text-muted hover:bg-white/5 hover:text-white"
            }`}
          >
            <FaCog className={isSettingsOpen ? "animate-spin-slow" : ""} />
          </button>
          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            title="Sign Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-20 right-4 w-64 glass-panel border border-white/10 p-2 shadow-2xl z-50 backdrop-blur-2xl"
          >
            <div className="space-y-1">
              <button
                onClick={handleDataManagementClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <FaDatabase className="text-accent" />
                Data & Storage
              </button>
              <button
                onClick={handleAboutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <FaInfoCircle className="text-accent" />
                About App
              </button>
              <div className="h-px bg-white/5 my-1" />
              <div className="px-4 py-2">
                <p className="text-[10px] font-bold text-text-muted/40 uppercase tracking-[0.2em]">
                  App Settings
                </p>
              </div>
              <label className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-all group">
                <span className="text-sm text-text-muted group-hover:text-white transition-colors">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <button
                  onClick={onToggleDarkMode}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${
                    darkMode ? "bg-accent/20" : "bg-accent"
                  }`}
                >
                  <motion.div
                    animate={{ x: darkMode ? 22 : 4 }}
                    className={`absolute top-1 w-3 h-3 rounded-full shadow-sm ${
                      darkMode ? "bg-accent" : "bg-white"
                    }`}
                  />
                </button>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default Sidebar;
