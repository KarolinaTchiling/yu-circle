import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";
import Thumbs from "/thumbs.svg";
import Clock from "/clock.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentThread from "./CommentThread";

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
  highlightCommentId?: number | null;
}

const PostPopup: React.FC<PostModalProps> = ({ postId, onClose, highlightCommentId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    fetchPost();
  }, [postId]);

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


  const handleCancelReply = () => {
    setActiveReplyId(null);
    setReplyContent("");
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !user?.username || !post) return;
  
    const payload: any = {
      content: replyContent,
      username: user.username,
      postId: post.id,
    };
  
    if (activeReplyId !== null) {
      payload.parentId = activeReplyId;
    }
  
    try {
      const res = await fetch("http://localhost:8081/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error("Failed to submit comment");
  
      console.log("Comment submitted");
      await fetchPost();
      handleCancelReply();

    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };



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
                <CommentThread
                  key={comment.commentId}
                  comment={comment}
                  activeReplyId={activeReplyId}
                  replyContent={replyContent}
                  onReply={(id) => {
                    setActiveReplyId(id);
                    setReplyContent("");
                  }}
                  setReplyContent={setReplyContent}
                  onCancel={handleCancelReply}
                  onSubmit={handleSubmitReply}
                  refreshPost={fetchPost}
                  highlightCommentId={highlightCommentId} 
                />
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