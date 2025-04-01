import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import { AuthContext } from "../../context/AuthContext";
import Thumb from "/thumb.svg";
import ThumbFill from "/thumb-fill.svg";
import ProfilePopup from '../ProfilePopup'; 

const discourseURL = import.meta.env.VITE_DISCOURSE_URL;

type Comment = {
  commentId: number;
  content: string;
  username: string;
  parentComment: Comment | null;
  timestamp: string;
  replies: Comment[];
  likes?: number;
  likedByUser?: boolean;
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
  highlightCommentId?: number | null;
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
  highlightCommentId
}) => {
    const { user } = useContext(AuthContext)!;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [likes, setLikes] = useState(comment.likes ?? 0);
    const [likedByUser, setLikedByUser] = useState(comment.likedByUser ?? false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleEditSubmit = async () => {
        try {
          const res = await fetch(`${discourseURL}/comments/update/${comment.commentId}`, {
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
          const res = await fetch(`${discourseURL}/comments/delete/${comment.commentId}`, {
            method: "DELETE",
          });
      
          if (!res.ok) throw new Error("Failed to delete comment");
      
          await refreshPost();
        } catch (err) {
          console.error("Error deleting comment:", err);
        }
    };

    const toggleCommentLike = async () => {
        if (!user?.username) return;
    
        const url = likedByUser
          ? `${discourseURL}/comments/unlike`
          : `${discourseURL}/comments/like`;
    
        try {
          const res = await fetch(url, {
            method: likedByUser ? "DELETE" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user.username, commentId: comment.commentId }),
          });
    
          if (!res.ok) throw new Error("Failed to toggle like");
    
          setLikes((prev) => likedByUser ? prev - 1 : prev + 1);
          setLikedByUser((prev) => !prev);
        } catch (err) {
          console.error("Error toggling like:", err);
        }
      };

    const isReplying = activeReplyId === comment.commentId;
    const isAuthor = user?.username === comment.username;
    const isHighlighted = highlightCommentId === comment.commentId;

    return (
      <>
        <div
            className={`border border-black rounded-lg p-3 mb-3 ml-${level * 4} ${
                level === 0 ? "bg-offwhite" : "bg-white"
            } ${isHighlighted ? "ring-2 ring-purple-500 bg-yellow-100" : ""}`}
            >
              {/* <p>{comment.commentId}</p> */}
            <button
                onClick={() => setIsPopupOpen(true)}
                className="text-dark-teal text-sm underline cursor-pointer hover:text-teal-700 transition-colors duration-200"
                >
                {comment.username}
            </button>
    
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

                <div className="flex flex-row">

                    {user && (
                      <button
                        onClick={() => onReply(comment.commentId)}
                        className="text-xs mr-4 py-1 px-2 bg-purple text-black border border-black rounded hover:bg-bright-purple transition"
                      >
                        Reply
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                        <span className="text-sm font-semibold">{likes}</span>
                        {user ? (
                            <button onClick={toggleCommentLike} className="focus:outline-none">
                              <img
                                src={likedByUser ? ThumbFill : Thumb}
                                className="h-5 w-5 object-contain cursor-pointer"
                                alt="Like"
                              />
                            </button>
                          ) : (
                            <img
                              src={Thumb}
                              className="h-5 w-5 object-contain opacity-60"
                              alt="Like (login to interact)"
                              title="Login to like this comment"
                            />
                          )}

                    </div>
                </div>
    
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
                  highlightCommentId={highlightCommentId}
                />
              ))}
            </div>
          )}
        </div>

          {isPopupOpen && (
            <ProfilePopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            username={comment.username}
            />
          )}
        </>
      );
    };
    
    export default CommentThread;