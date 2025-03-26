import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header/Header";
import { FaTrash, FaClock, FaThumbsUp, FaUser, FaPen } from "react-icons/fa";

const API_URL = "http://localhost:8081";
const PROFILE_API_URL = "http://localhost:8082";

interface Comment {
  commentId: number;
  content: string | null;
  likes: number;
  liked: boolean;
  username: string;
  parentComment?: any;
  replies?: Comment[];
}

interface Post {
  id: number;
  title?: string;
  content: string | null;
  likes: number;
  liked: boolean;
  username: string;
  isDeleted?: boolean;
  comments: Comment[];
  createdAt?: string;
}

function getTotalCommentCount(comments: Comment[]): number {
  let count = 0;
  for (const comment of comments) {
    if (comment.username !== "Deleted") {
      count += 1 + getTotalCommentCount(comment.replies || []);
    }
  }
  return count;
}

function formatTimeAgo(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

const DiscoursePage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const toggleExpand = (postId: number) => {
    if (expandedPosts.includes(postId)) {
      setExpandedPosts(expandedPosts.filter((id) => id !== postId));
    } else {
      setExpandedPosts([...expandedPosts, postId]);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      const sortedPosts = response.data.sort((a: Post, b: Post) => b.id - a.id);
      setAllPosts(sortedPosts);
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // Retrieve the logged-in username from localStorage
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      // Fetch all profiles and then find the matching profile
      axios
        .get(`${PROFILE_API_URL}/community/get-default-profiles`)
        .then((res) => {
          const profiles = res.data;
          const found = profiles.find((p: any) => p.username === storedUser);
          setCurrentUser(found ? found.username : storedUser);
        })
        .catch((error) => {
          console.error("Error fetching profiles:", error);
          setCurrentUser(storedUser);
        });
    }
  }, []);

  const createPost = async () => {
    if (!newTitle.trim() || !newPost.trim()) return;
    try {
      await axios.post(
        `${API_URL}/posts`,
        { title: newTitle, content: newPost, username: currentUser },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchPosts();
      setNewPost("");
      setNewTitle("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/posts/delete/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const createComment = async (postId: number) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;
    try {
      await axios.post(
        `${API_URL}/comments`,
        { content, username: currentUser, postId },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchPosts();
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (_postId: number, commentId: number) => {
    try {
      await axios.delete(`${API_URL}/comments/delete/${commentId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const updateComment = async (commentId: number) => {
    if (!editCommentText.trim()) return;
    try {
      await axios.put(
        `${API_URL}/comments/update/${commentId}`,
        { content: editCommentText },
        { headers: { "Content-Type": "application/json" } }
      );
      setEditingCommentId(null);
      setEditCommentText("");
      fetchPosts();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title ?? "");
    setEditContent(post.content ?? "");
  };

  const updatePost = async () => {
    if (!editingPost) return;
    try {
      const payload = { title: editTitle, content: editContent };
      await axios.put(`${API_URL}/posts/update/${editingPost.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === editingPost.id
            ? { ...p, title: editTitle, content: editContent }
            : p
        )
      );
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      setEditingPost(null);
      setEditTitle("");
      setEditContent("");
    }
  };

  const visiblePosts = allPosts.filter((post) => post.username !== "Deleted");
  const typeFiltered = visiblePosts.filter((post) => {
    if (!selectedType || selectedType === "All") return true;
    const combined = `${(post.title ?? "").toLowerCase()} ${(
      post.content ?? ""
    ).toLowerCase()}`;
    return combined.includes(selectedType.toLowerCase());
  });
  const programFiltered = typeFiltered.filter((post) => {
    if (!selectedProgram || selectedProgram === "All") return true;
    const combined = `${(post.title ?? "").toLowerCase()} ${(
      post.content ?? ""
    ).toLowerCase()}`;
    return combined.includes(selectedProgram.toLowerCase());
  });
  const finalFilteredPosts = programFiltered.filter((post) => {
    const combined = `${(post.title ?? "").toLowerCase()} ${(
      post.content ?? ""
    ).toLowerCase()}`;
    const words = filter.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return true;
    return words.every((word) => combined.includes(word));
  });
  const isNoneMatching = finalFilteredPosts.length === 0;

  return (
    <>
      <Header />
      <main className="flex">
        <aside className="w-80 min-w-[280px] p-4 flex-shrink-0">
          <div className="mb-4">
            <label className="block font-bold mb-2">Current Username:</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="Current Username"
              value={currentUser}
              readOnly
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full h-12 rounded bg-[var(--color-red)] text-2xl flex items-center justify-center font-fancy text-white transition hover:bg-red-700 mb-4"
          >
            Create a Post
          </button>
          <input
            className="w-full p-2 border rounded mb-4 bg-white"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <div className="border rounded p-4">
            <h2 className="font-bold mb-2">Filter Feed</h2>
            <div className="mb-4">
              <h3 className="font-semibold">By Type</h3>
              <div className="flex flex-col ml-2">
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="All"
                    checked={selectedType === "" || selectedType === "All"}
                    onChange={() => setSelectedType("All")}
                    className="mr-2"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="Study Partners"
                    checked={selectedType === "Study Partners"}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Study Partners</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="Mentor - Mentee"
                    checked={selectedType === "Mentor - Mentee"}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Mentor - Mentee</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="Advice"
                    checked={selectedType === "Advice"}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Advice</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="Course Questions"
                    checked={selectedType === "Course Questions"}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Course Questions</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="typeFilter"
                    value="Meet-ups"
                    checked={selectedType === "Meet-ups"}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  <span>Meet-ups</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">By Program</h3>
              <div className="flex flex-col ml-2">
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="All"
                    checked={
                      selectedProgram === "" || selectedProgram === "All"
                    }
                    onChange={() => setSelectedProgram("All")}
                    className="mr-2"
                  />
                  <span>All</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Engineering"
                    checked={selectedProgram === "Engineering"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Engineering</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Science"
                    checked={selectedProgram === "Science"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Science</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Business"
                    checked={selectedProgram === "Business"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Business</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Liberal Arts"
                    checked={selectedProgram === "Liberal Arts"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Liberal Arts</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Education"
                    checked={selectedProgram === "Education"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Education</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Economics"
                    checked={selectedProgram === "Economics"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Economics</span>
                </label>
                <label className="flex items-center mb-1">
                  <input
                    type="radio"
                    name="programFilter"
                    value="Health"
                    checked={selectedProgram === "Health"}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="mr-2"
                  />
                  <span>Health</span>
                </label>
              </div>
            </div>
          </div>
        </aside>
        <section className="flex-1 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label>Sort by</label>
              <select className="border rounded p-1">
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
            <input
              className="p-2 border rounded bg-white w-60"
              placeholder="Search posts..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <h1 className="text-2xl font-bold mb-4">Discourse Page</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-20 right-20 w-20 h-20 rounded-full bg-[var(--color-red)] text-2xl flex items-center justify-center font-fancy text-white transition hover:bg-red-700"
          >
            +
          </button>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 border">
                <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
                <input
                  className="w-full p-2 border rounded-lg mb-2"
                  placeholder="Post Title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <textarea
                  className="w-full h-30 p-2 border rounded-lg"
                  placeholder="Write a post..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    className="w-20 rounded-lg bg-gray-400 p-3 font-fancy text-white transition hover:bg-gray-700"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-20 rounded-lg bg-[var(--color-red)] p-3 font-fancy text-white transition hover:bg-red-700"
                    onClick={createPost}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}
          {editingPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 border">
                <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
                <input
                  className="w-full p-2 border rounded-lg mb-2"
                  placeholder="Edit Title..."
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full h-30 p-2 border rounded-lg"
                  placeholder="Edit Content..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    className="w-20 rounded-lg bg-gray-400 p-3 font-fancy text-white transition hover:bg-gray-700"
                    onClick={() => {
                      setEditingPost(null);
                      setEditTitle("");
                      setEditContent("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="w-20 rounded-lg bg-[var(--color-red)] p-3 font-fancy text-white transition hover:bg-red-700"
                    onClick={updatePost}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
          <input
            className="w-full p-2 border rounded mb-4 bg-white"
            placeholder="Search posts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {loading ? (
            <p>Loading posts...</p>
          ) : isNoneMatching ? (
            <p>No posts found.</p>
          ) : (
            finalFilteredPosts.map((post) => {
              const timeAgo = formatTimeAgo(post.createdAt);
              const totalVisibleComments = post.comments.filter(
                (comment) => comment.username !== "Deleted"
              ).length;
              return (
                <div
                  key={post.id}
                  className="p-4 rounded mb-4 border relative"
                  style={{ backgroundColor: "#E8EBE4" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-base">
                      {post.title || "No title"}
                    </h2>
                    <div className="flex items-center space-x-1 text-[#006D66]">
                      <span className="text-sm">{post.username}</span>
                      <div className="w-6 h-6 border border-[#006D66] rounded-full flex items-center justify-center">
                        <FaUser size={10} />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{post.content}</p>
                  <div className="flex items-center space-x-2 text-sm mb-2">
                    <div className="flex items-center text-[#006D66]">
                      <FaClock className="mr-1" size={14} />
                      <span>{timeAgo}</span>
                    </div>
                    <div className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center">
                      {totalVisibleComments}{" "}
                      {totalVisibleComments === 1 ? "comment" : "comments"}
                    </div>
                    <div className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center">
                      {post.likes}
                      <FaThumbsUp className="ml-1" size={14} />
                    </div>
                    <div
                      onClick={() => handleEditClick(post)}
                      className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer"
                    >
                      <FaPen className="mr-1" size={14} />
                      Edit
                    </div>
                    <div
                      onClick={() => deletePost(post.id)}
                      className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer"
                    >
                      <FaTrash className="mr-1" size={14} />
                      Delete
                    </div>
                  </div>
                  <button
                    className="text-sm text-blue-600 mb-2"
                    onClick={() => toggleExpand(post.id)}
                  >
                    {expandedPosts.includes(post.id)
                      ? "Hide Comments"
                      : "View Comments"}
                  </button>
                  {expandedPosts.includes(post.id) && (
                    <div className="mt-2 ml-4">
                      {post.comments
                        .filter((comment) => comment.username !== "Deleted")
                        .map((comment) => {
                          const isEditing =
                            editingCommentId === comment.commentId;
                          return (
                            <div
                              key={comment.commentId}
                              className="border border-gray-200 p-2 rounded mb-2 bg-white"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">
                                  {comment.username}
                                </span>
                              </div>
                              {isEditing ? (
                                <div>
                                  <textarea
                                    className="w-full p-2 border rounded mb-2"
                                    value={editCommentText}
                                    onChange={(e) =>
                                      setEditCommentText(e.target.value)
                                    }
                                  />
                                  <div className="flex items-center space-x-2">
                                    <div
                                      className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer text-xs"
                                      onClick={() =>
                                        updateComment(comment.commentId)
                                      }
                                    >
                                      Save
                                    </div>
                                    <div
                                      className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer text-xs"
                                      onClick={() => {
                                        setEditingCommentId(null);
                                        setEditCommentText("");
                                      }}
                                    >
                                      Cancel
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p>
                                  {comment.content || "No content available."}
                                </p>
                              )}
                              {!isEditing && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <div
                                    className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer text-xs"
                                    onClick={() => {
                                      setEditingCommentId(comment.commentId);
                                      setEditCommentText(comment.content || "");
                                    }}
                                  >
                                    <FaPen className="mr-1" size={12} />
                                    Edit
                                  </div>
                                  <div
                                    className="bg-[#c0ddd7] px-2 py-1 rounded-full flex items-center cursor-pointer text-xs"
                                    onClick={() =>
                                      deleteComment(post.id, comment.commentId)
                                    }
                                  >
                                    <FaTrash className="mr-1" size={12} />
                                    Delete
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({
                            ...commentInputs,
                            [post.id]: e.target.value,
                          })
                        }
                      />
                      <button
                        className="mt-1 bg-green-500 text-white px-3 py-1 rounded text-sm"
                        onClick={() => createComment(post.id)}
                      >
                        Comment
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </main>
    </>
  );
};

export default DiscoursePage;
