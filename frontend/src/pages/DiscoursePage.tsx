import React, { useState } from "react";
import Header from "../components/Header/Header";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";

interface Comment {
  id: number;
  content: string;
  likes: number;
  liked: boolean;
}

interface Post {
  id: number;
  content: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

const DiscoursePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content:
        "Hi I am looking for a mentor to study for my EECS 2011 with! Is anyone interested?",
      likes: 0,
      liked: false,
      comments: [
        {
          id: 101,
          content:
            "Hi! I am your classmate Megan. Send me a message here and we can connect",
          likes: 0,
          liked: false,
        },
      ],
    },
    {
      id: 2,
      content:
        "I am looking for a master's student as a mentor to help with a passion project. Is anyone interested?",
      likes: 0,
      liked: false,
      comments: [],
    },
  ]);

  const [newPost, setNewPost] = useState("");
  const [filter, setFilter] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>(
    {}
  );

  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const createPost = () => {
    if (!newPost.trim()) return;
    const newId = Math.max(...posts.map((p) => p.id)) + 1;
    setPosts([
      {
        id: newId,
        content: newPost,
        likes: 0,
        liked: false,
        comments: [],
      },
      ...posts,
    ]);
    setNewPost("");
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Discourse Page</h1>

          {/* super cool floating button for creating posts*/}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-20 right-20 w-20 h-20 rounded-full bg-[var(--color-red)] text-2xl flex items-center justify-center font-fancy text-white transition hover:bg-red-700"
          >
            +
          </button>

          {/* popup dialog box*/}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-[0.5px] flex items-start justify-center pt-30">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96 border">
                <h2 className="text-lg font-semibold mb-4">Create a Post</h2>
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

          {/* Search filter */}
          <input
            className="w-full p-2 border rounded mb-4 bg-white"
            placeholder="Search posts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          {posts.length > 0 ? (
            posts
              .filter((post) =>
                post.content.toLowerCase().includes(filter.toLowerCase())
              )
              .map((post) => (
                <div key={post.id} className="bg-white p-4 rounded shadow mb-4">
                  <p>{post.content}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        setPosts((prev) =>
                          prev.map((p) =>
                            p.id === post.id
                              ? {
                                ...p,
                                liked: !p.liked,
                                likes: p.liked ? p.likes - 1 : p.likes + 1,
                              }
                              : p
                          )
                        )
                      }
                      className="mr-4 flex items-center"
                    >
                      {post.liked ? (
                        <AiFillLike className="text-blue-500" />
                      ) : (
                        <AiOutlineLike />
                      )}
                      &nbsp;{post.likes}
                    </button>
                    <button
                      onClick={() =>
                        setPosts((prev) => prev.filter((p) => p.id !== post.id))
                      }
                      className="text-red-500 flex items-center"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-4 ml-4">
                    <h3 className="font-semibold mb-2">Comments:</h3>
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border border-gray-200 p-2 rounded mb-2"
                      >
                        <p>{comment.content}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() =>
                              setPosts((prev) =>
                                prev.map((p) =>
                                  p.id === post.id
                                    ? {
                                      ...p,
                                      comments: p.comments.map((c) =>
                                        c.id === comment.id
                                          ? {
                                            ...c,
                                            liked: !c.liked,
                                            likes: c.liked
                                              ? c.likes - 1
                                              : c.likes + 1,
                                          }
                                          : c
                                      ),
                                    }
                                    : p
                                )
                              )
                            }
                            className="mr-4 flex items-center"
                          >
                            {comment.liked ? (
                              <AiFillLike className="text-blue-500" />
                            ) : (
                              <AiOutlineLike />
                            )}
                            &nbsp;{comment.likes}
                          </button>
                          <button
                            onClick={() =>
                              setPosts((prev) =>
                                prev.map((p) =>
                                  p.id === post.id
                                    ? {
                                      ...p,
                                      comments: p.comments.filter(
                                        (c) => c.id !== comment.id
                                      ),
                                    }
                                    : p
                                )
                              )
                            }
                            className="text-red-500 flex items-center"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* New Comment Input */}
                    <div className="mt-2">
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
                        onClick={() => {
                          if (commentInputs[post.id]?.trim()) {
                            setPosts((prev) =>
                              prev.map((p) =>
                                p.id === post.id
                                  ? {
                                    ...p,
                                    comments: [
                                      ...p.comments,
                                      {
                                        id: Date.now(),
                                        content: commentInputs[post.id],
                                        likes: 0,
                                        liked: false,
                                      },
                                    ],
                                  }
                                  : p
                              )
                            );
                            setCommentInputs({ ...commentInputs, [post.id]: "" });
                          }
                        }}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>Loading posts...</p>
          )}
        </div>
      </main>
    </>
  );
};

export default DiscoursePage;
