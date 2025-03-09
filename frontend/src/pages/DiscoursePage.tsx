import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header/Header";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

const API_URL = "http://localhost:8080";

interface Comment {
  id: number;
  content: string | null;
  likes: number;
  liked: boolean;
}

interface Post {
  id: number;
  title?: string;
  content: string | null;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

const DiscoursePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`);
      const sortedPosts = response.data.sort((a: Post, b: Post) => b.id - a.id);
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

  const createPost = async () => {
    if (!newTitle.trim() || !newPost.trim()) return;
    try {
      await axios.post(
        `${API_URL}/posts`,
        {
          title: newTitle,
          content: newPost,
          username: "User123",
        },
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
      await axios.delete(`${API_URL}/posts/${id}`);
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
        {
          content,
          username: "User123",
          postId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchPosts();
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const deleteComment = async (postId: number, commentId: number) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <div className="max-w-2xl mx-auto p-4">
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
          <input
            className="w-full p-2 border rounded mb-4 bg-white"
            placeholder="Search posts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {loading ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            posts
              .filter((post) =>
                (post.content ? post.content.toLowerCase() : "").includes(
                  filter.toLowerCase()
                )
              )
              .map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
                  {post.title && <h2 className="font-bold">{post.title}</h2>}
                  <p>{post.content || "No content available."}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-500 flex items-center"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="mt-4 ml-4">
                    <h3 className="font-semibold mb-2">Comments:</h3>
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border border-gray-200 p-2 rounded mb-2"
                      >
                        <p>{comment.content || "No content available."}</p>
                        <button
                          onClick={() => deleteComment(post.id, comment.id)}
                          className="text-red-500 flex items-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
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
                      className="mt-1 bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => createComment(post.id)}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default DiscoursePage;
