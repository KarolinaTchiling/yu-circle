import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const discourseURL = import.meta.env.VITE_DISCOURSE_URL;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose}) => {
  const { user } = useContext(AuthContext)!;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    if (!user?.username) return;

    setLoading(true);

    try {
      const res = await fetch(`${discourseURL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          username: user.username,
        }),
      });

      if (!res.ok) throw new Error("Failed to create post");

      // Clear form and close modal
      setTitle("");
      setContent("");
      onClose();
      window.location.reload(); 
    } catch (err) {
      console.error("Error creating post:", err);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[500px] border border-black rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Create a New Post</h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border border-black rounded px-3 py-2"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          className="w-full border border-black rounded px-3 py-2"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-black rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1 border border-black rounded bg-minter hover:bg-mint disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;

