import { useEffect, useState } from "react";
import React from "react";
import Thumbs from "/thumbs.svg";
import Clock from "/clock.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Comment = {
  commentId: number;
  content: string;
  username: string;
  parentComment: Comment | null;
  timestamp: string;
  replies: Comment[];
};

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  timestamp: string;
  comments: Comment[];
};

interface PostModalProps {
  postId: number;
  onClose: () => void;
}

const PostPopup: React.FC<PostModalProps> = ({ postId, onClose }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8081/posts/${postId}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg border border-black p-6 w-[95%] max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
        {loading ? (
          <p className="text-center text-sm italic">Loading post...</p>
        ) : post ? (
          <>
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="text-sm mt-2">{post.content}</p>

            <div className="flex justify-between mt-3 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <img src={Clock} className="h-5" />
                <span>{dayjs(post.timestamp).fromNow()}</span>
              </div>
              <span>Posted by {post.username}</span>
            </div>

            <hr className="my-4 border-black" />

            <h3 className="text-lg font-semibold mb-2">Comments</h3>

            {post.comments.length === 0 ? (
              <p className="italic text-sm text-gray-500">No comments yet.</p>
            ) : (
              post.comments.map((comment) => (
                <div
                  key={comment.commentId}
                  className="bg-offwhite border border-black rounded-lg p-3 mb-3"
                >
                  <p className="text-sm font-semibold">{comment.username}</p>
                  <p className="text-sm mt-1">{comment.content}</p>
                  <div className="text-xs text-gray-600 mt-1">
                    {dayjs(comment.timestamp).fromNow()}
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 ml-4 border-l border-gray-300 pl-4">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.commentId}
                          className="bg-white border border-black rounded-lg p-2 mb-2"
                        >
                          <p className="text-sm font-semibold">{reply.username}</p>
                          <p className="text-sm mt-1">{reply.content}</p>
                          <div className="text-xs text-gray-600 mt-1">
                            {dayjs(reply.timestamp).fromNow()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 border border-black rounded hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-red-600">Failed to load post.</p>
        )}
      </div>
    </div>
  );
};
  
  export default PostPopup;
