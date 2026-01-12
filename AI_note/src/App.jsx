import { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import ConfirmationModal from "./components/ConfirmationModal";
import DataManagementModal from "./components/DataManagementModal";
import AboutModal from "./components/AboutModal";
import ProfileModal from "./components/ProfileModal";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import noteService from "./services/notes";
import userService from "./services/user";
import axios from "axios";
import useSessionTimeout from "./hooks/useSessionTimeout";
import { AnimatePresence, motion } from "framer-motion";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Save State
  const [saveStatus, setSaveStatus] = useState("idle");

  // Check for existing user on load
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
      userService.setToken(user.token);
    }
    setLoading(false);
  }, []);

  // Fetch notes when user changes
  useEffect(() => {
    if (user) {
      noteService
        .getAll()
        .then((initialNotes) => {
          if (Array.isArray(initialNotes)) {
            setNotes(initialNotes);
          } else {
            setNotes([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
          if (error.response?.status === 401) {
            handleLogout();
          }
        });
    }
  }, [user]);

  const handleLoginSuccess = async (googleResponse, manualUserResponse) => {
    try {
      let userData;
      if (googleResponse) {
        const res = await axios.post("/api/auth/google", {
          credential: googleResponse.credential,
        });
        userData = res.data;
      } else {
        userData = manualUserResponse;
      }

      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(userData)
      );
      noteService.setToken(userData.token);
      userService.setToken(userData.token);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.message || "Failed to sign in. Please try again."
      );
    }
  };

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("loggedNoteAppUser");
    setUser(null);
    setNotes([]);
    setSelectedNote(null);
  }, []);

  // Session Timeout Hook
  const { isWarning, resetTimers } = useSessionTimeout({
    timeoutMinutes: 30,
    warningMinutes: 1,
    onLogout: handleLogout,
  });

  // Create a new note
  const handleAddNote = async (folderName = "General") => {
    try {
      const newNote = await noteService.create({
        title: "Untitled Note",
        content: "",
        folder: folderName,
        tags: [],
      });
      setNotes((prev) => [newNote, ...prev]);
      setSelectedNote(newNote);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Update a note
  const handleUpdateNote = async (updatedNote) => {
    setSaveStatus("saving");
    // Optimistically update UI
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
    setSelectedNote(updatedNote);

    // Send to server
    try {
      await noteService.update(updatedNote._id, updatedNote);
      setSaveStatus("saved");
      // Reset after a shorter delay
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch (error) {
      console.error("Error updating note:", error);
      setSaveStatus("error");
    }
  };

  // Request Delete (Opens Modal)
  const handleDeleteClick = (id) => {
    setNoteToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete (Actual Action)
  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await noteService.remove(noteToDelete);
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteToDelete));
      if (selectedNote && selectedNote._id === noteToDelete) {
        setSelectedNote(null);
      }
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Folder Management
  const handleAddFolder = async (folderName) => {
    try {
      const { folders } = await userService.addFolder(folderName);
      const updatedUser = { ...user, user: { ...user.user, folders } };
      setUser(updatedUser);
      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error("Error adding folder:", error);
      alert(error.response?.data?.message || "Failed to add folder");
    }
  };

  const handleDeleteFolder = async (folderName) => {
    try {
      const { folders } = await userService.deleteFolder(folderName);
      const updatedUser = { ...user, user: { ...user.user, folders } };
      setUser(updatedUser);
      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async (count) => {
    try {
      await noteService.bulkRemove(count);
      // Refresh notes from server or filter locally
      if (count) {
        // If count is provided, it's easier to just re-fetch to ensure sync with server's "oldest" logic
        const updatedNotes = await noteService.getAll();
        setNotes(updatedNotes);
      } else {
        // Clear all locally
        setNotes([]);
        setSelectedNote(null);
      }
      setIsDataManagementOpen(false);
    } catch (error) {
      console.error("Error bulk deleting notes:", error);
      alert("Failed to delete notes. Please try again.");
    }
  };

  const handleUpdateProfile = async (file) => {
    try {
      const response = await userService.updateProfile(file);
      const updatedUser = {
        ...user,
        user: {
          ...user.user,
          picture: response.user.picture,
        },
      };

      setUser(updatedUser);
      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(updatedUser)
      );
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddAttachment = async (noteId, file) => {
    try {
      const updatedNote = await noteService.addAttachment(noteId, file);
      setNotes(notes.map((n) => (n._id === noteId ? updatedNote : n)));
      if (selectedNote?._id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error adding attachment:", error);
      alert("Failed to upload attachment.");
    }
  };

  const handleRemoveAttachment = async (noteId, attachmentId) => {
    try {
      const updatedNote = await noteService.removeAttachment(
        noteId,
        attachmentId
      );
      setNotes(notes.map((n) => (n._id === noteId ? updatedNote : n)));
      if (selectedNote?._id === noteId) {
        setSelectedNote(updatedNote);
      }
    } catch (error) {
      console.error("Error removing attachment:", error);
      alert("Failed to remove attachment.");
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    const saved = window.localStorage.getItem("noteAppDarkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    window.localStorage.setItem("noteAppDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!darkMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return showAuth ? (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onLoginError={(error) => {
          console.error("Auth Error Details:", error);
        }}
        onBack={() => setShowAuth(false)}
        darkMode={darkMode}
      />
    ) : (
      <LandingPage onGetStarted={() => setShowAuth(true)} darkMode={darkMode} />
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 h-full overflow-hidden"
          >
            <Sidebar
              notes={notes}
              onSelectNote={setSelectedNote}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteClick}
              onLogout={handleLogout}
              onOpenDataManagement={() => setIsDataManagementOpen(true)}
              onOpenAbout={() => setIsAboutOpen(true)}
              onOpenProfile={() => setIsProfileOpen(true)}
              user={user.user}
              selectedNoteId={selectedNote?._id}
              onReorder={setNotes}
              folders={user.user.folders || ["General"]}
              onAddFolder={handleAddFolder}
              onDeleteFolder={handleDeleteFolder}
              onUpdateNote={handleUpdateNote}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              onClose={() => setIsSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        saveStatus={saveStatus}
        onAddAttachment={handleAddAttachment}
        onRemoveAttachment={handleRemoveAttachment}
        darkMode={darkMode}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Note?"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />

      <DataManagementModal
        isOpen={isDataManagementOpen}
        onClose={() => setIsDataManagementOpen(false)}
        onBulkDelete={handleBulkDelete}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user.user}
        totalNotes={notes.length}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Session Timeout Warning */}
      <AnimatePresence>
        {isWarning && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-bg-secondary w-full max-w-md rounded-2xl p-8 border border-white/10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                Session Expiring
              </h2>
              <p className="text-text-secondary mb-8">
                Your session is about to expire due to inactivity. You will be
                logged out automatically in about a minute.
              </p>
              <button
                onClick={resetTimers}
                className="w-full py-4 bg-accent hover:bg-accent-hover text-white rounded-xl font-semibold transition-all shadow-lg shadow-accent/20 active:scale-[0.98]"
              >
                Stay Logged In
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
