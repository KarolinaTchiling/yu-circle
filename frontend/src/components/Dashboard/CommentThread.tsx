import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { AuthContext } from "../../context/AuthContext";

type Comment = {
  commentId: number;
  content: string;
  username: string;
  parentComment: Comment | null;
  timestamp: string;
  replies: Comment[];
};

interface Props {
  comment: Comment;
  level?: number;
  activeReplyId: number | null;
  replyContent: string;
  onReply: (commentId: number) => void;
  setReplyContent: (val: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  refreshPost: () => void;
}

const CommentThread: React.FC<Props> = ({
  comment,
  level = 0,
  activeReplyId,
  replyContent,
  onReply,
  setReplyContent,
  onCancel,
  onSubmit,
  refreshPost,
}) => {
    const { user } = useContext(AuthContext)!;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const handleEditSubmit = async () => {
        try {
          const res = await fetch(`http://localhost:8081/comments/update/${comment.commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: editContent }),
          });
    
          if (!res.ok) throw new Error("Failed to update comment");
    
          setIsEditing(false);
          await refreshPost();
        } catch (err) {
          console.error("Error updating comment:", err);
        }

    };
    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this comment?");
        if (!confirmed) return;
      
        try {
          const res = await fetch(`http://localhost:8081/comments/delete/${comment.commentId}`, {
            method: "DELETE",
          });
      
          if (!res.ok) throw new Error("Failed to delete comment");
      
          await refreshPost();
        } catch (err) {
          console.error("Error deleting comment:", err);
        }
    };

    const isReplying = activeReplyId === comment.commentId;
    const isAuthor = user?.username === comment.username;

    return (
        <div
          className={`bg-${level === 0 ? "offwhite" : "white"} border border-black rounded-lg p-3 mb-3 ml-${level * 4}`}
        >
          <p className="text-sm font-semibold">{comment.username}</p>
    
          {isEditing ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-black rounded p-2 text-sm mt-1"
                rows={2}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm border border-black rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-3 py-1 text-sm border border-black rounded bg-mint hover:bg-minter"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="text-xs text-gray-600 mt-1">
                {dayjs(comment.timestamp).fromNow()}
              </div>
    
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => onReply(comment.commentId)}
                  className="text-xs py-1 px-2 bg-purple text-black border border-black rounded hover:bg-bright-purple transition"
                >
                  Reply
                </button>
    
                {isAuthor && (
                <div className="flex gap-2">
                    <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs py-1 px-2 bg-yellow-300 border border-black rounded hover:bg-yellow-400 transition"
                    >
                    Edit
                    </button>
                    <button
                    onClick={handleDelete}
                    className="text-xs py-1 px-2 bg-light-red border border-black rounded hover:bg-red/50 transition"
                    >
                    Delete
                    </button>
                </div>
                )}
              </div>
            </>
          )}
    
          {isReplying && (
            <div className="mt-2">
              <textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full border border-black rounded p-2 text-sm"
                rows={2}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={onCancel}
                  className="px-3 py-1 text-sm border border-black rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  className="px-3 py-1 text-sm border border-black rounded bg-mint hover:bg-minter"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
    
          {comment.replies.length > 0 && (
            <div className="mt-3 pl-4 border-l border-gray-300">
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.commentId}
                  comment={reply}
                  level={level + 1}
                  activeReplyId={activeReplyId}
                  replyContent={replyContent}
                  onReply={onReply}
                  setReplyContent={setReplyContent}
                  onCancel={onCancel}
                  onSubmit={onSubmit}
                  refreshPost={refreshPost}
                />
              ))}
            </div>
          )}
        </div>
      );
    };
    
    export default CommentThread;