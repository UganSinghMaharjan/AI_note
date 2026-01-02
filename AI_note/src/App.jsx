import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import ConfirmationModal from "./components/ConfirmationModal";
import DataManagementModal from "./components/DataManagementModal";
import AboutModal from "./components/AboutModal";
import ProfileModal from "./components/ProfileModal";
import LoginPage from "./components/LoginPage";
import noteService from "./services/notes";
import userService from "./services/user";
import axios from "axios";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);

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
    // MOCK USER FOR VERIFICATION - REMOVE LATER
    if (!window.localStorage.getItem("loggedNoteAppUser")) {
      const mockUser = {
        token: "mock-token",
        user: {
          name: "John Doe",
          email: "john@example.com",
          picture: "https://ui-avatars.com/api/?name=John+Doe",
        },
      };
      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(mockUser)
      );
      setUser(mockUser);
    }

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

  const handleLoginSuccess = async (response) => {
    try {
      const res = await axios.post("/api/auth/google", {
        credential: response.credential,
      });
      const userData = res.data;

      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(userData)
      );
      noteService.setToken(userData.token);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteAppUser");
    setUser(null);
    setNotes([]);
    setSelectedNote(null);
  };

  // Create a new note
  const handleAddNote = async () => {
    try {
      const newNote = await noteService.create({
        title: "Untitled Note",
        content: "",
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
      alert("Failed to update profile picture.");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onLoginError={(error) => {
          console.error("Google Sign-In Error Details:", error);
          alert(
            "Google Sign-In was unsuccessful. Check the console for details."
          );
        }}
      />
    );
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden">
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
      />

      <Editor
        note={selectedNote}
        onUpdateNote={handleUpdateNote}
        saveStatus={saveStatus}
        onAddAttachment={handleAddAttachment}
        onRemoveAttachment={handleRemoveAttachment}
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
    </div>
  );
}

export default App;
