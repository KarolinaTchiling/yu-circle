import React from "react";
import dayjs from "dayjs";

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
}) => {
  const isReplying = activeReplyId === comment.commentId;

  return (
    <div className={`bg-${level === 0 ? "offwhite" : "white"} border border-black rounded-lg p-3 mb-3 ml-${level * 4}`}>
      <p className="text-sm font-semibold">{comment.username}</p>
      <p className="text-sm mt-1">{comment.content}</p>
      <div className="text-xs text-gray-600 mt-1">
        {dayjs(comment.timestamp).fromNow()}
      </div>

      <div className="flex justify-start mt-2">
        <button
          onClick={() => onReply(comment.commentId)}
          className="text-xs py-1 px-2 bg-purple text-black border border-black rounded hover:bg-bright-purple transition"
        >
          Reply
        </button>
      </div>

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentThread;
