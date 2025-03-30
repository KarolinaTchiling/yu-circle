import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import React from "react";
import Thumb from "/thumb.svg";
import ThumbFill from "/thumb-fill.svg";
import Clock from "/clock.svg";
import dayjs from "dayjs";
import CommentThread from "./CommentThread";
import ProfilePopup from '../ProfilePopup'; 

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

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  timestamp: string;
  comments: Comment[];
  likes?: number;
  likedByUser?: boolean;
};

interface PostViewProps {
  postId: number;
  highlightCommentId?: number | null;
}

const PostComp: React.FC<PostViewProps> = ({ postId, highlightCommentId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { user } = useContext(AuthContext)!;

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8081/posts/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      const postData: Post = await res.json();

      const likedCommentsRes = await fetch(`http://localhost:8081/comments/like/username/${user?.username}`);
      const likedComments: { commentId: number }[] = likedCommentsRes.ok ? await likedCommentsRes.json() : [];
      const likedCommentIds = likedComments.map((entry) => entry.commentId);

      const postLikesRes = await fetch(`http://localhost:8081/posts/like/postid/${postData.id}`);
      const postLikes = postLikesRes.ok ? await postLikesRes.json() : [];
      const postLikesCount = postLikes.length;
      const likedByUser = user ? postLikes.some((like: any) => like.username === user.username) : false;

      const enrichComments = async (comments: Comment[]): Promise<Comment[]> => {
        return Promise.all(
          comments.map(async (comment) => {
            try {
              const likeRes = await fetch(`http://localhost:8081/comments/like/commentid/${comment.commentId}`);
              const allLikes = likeRes.ok ? await likeRes.json() : [];
              const likes = allLikes.length;
              const likedByUser = likedCommentIds.includes(comment.commentId);
              const enrichedReplies = await enrichComments(comment.replies || []);
              return {
                ...comment,
                likes,
                likedByUser,
                replies: enrichedReplies,
              };
            } catch {
              return { ...comment, likes: 0, likedByUser: false, replies: [] };
            }
          })
        );
      };

      const enrichedComments = await enrichComments(postData.comments);

      setPost({
        ...postData,
        likes: postLikesCount,
        likedByUser,
        comments: enrichedComments,
      });
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user || !post) return;
    const liked = post.likedByUser;
    const url = liked ? "http://localhost:8081/posts/unlike" : "http://localhost:8081/posts/like";

    try {
      const res = await fetch(url, {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, postId: post.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      setPost({
        ...post,
        likes: liked ? (post.likes ?? 1) - 1 : (post.likes ?? 0) + 1,
        likedByUser: !liked,
      });
    } catch (err) {
      console.error("Error toggling like:", err);
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

      await fetchPost();
      handleCancelReply();
    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };

  return (
    <div className="bg-light-green rounded-lg border border-black p-6 w-full max-w-6xl">
      {loading ? (
        <p className="text-center text-sm italic">Loading post...</p>
      ) : post ? (
        <>
          <h2 className="text-2xl font-bold break-words whitespace-pre-wrap">{post.title}</h2> 
          {/* <p>{post.id}</p> */}
          <p className="text-sm mt-2 break-words whitespace-pre-wrap">{post.content}</p>

          <div className="flex justify-between mt-3 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2">
              <img src={Clock} className="h-5" />
              <span>{dayjs(post.timestamp).fromNow()}</span>
              <div className="pl-3 flex items-center gap-1">
                <span>{post.likes ?? 0}</span>
                <button onClick={toggleLike} className="focus:outline-none">
                  <img
                    src={post.likedByUser ? ThumbFill : Thumb}
                    className="h-5 w-5 object-contain cursor-pointer"
                    alt="Like"
                  />
                </button>
              </div>
            </div>

            <div>
              <span>Posted by </span>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="text-dark-teal underline cursor-pointer hover:text-teal-700 transition-colors duration-200"
              >
                {post.username}
              </button>
             
              <div className="font-normal">
              {isPopupOpen && (
                <ProfilePopup
                  isOpen={isPopupOpen}
                  onClose={() => setIsPopupOpen(false)}
                  username={post.username}
                />
              )}
              </div>
            </div>
          </div>

          {/* Reply to post */}
          {user && (
            <div className="mt-4 p-3 rounded-md border bg-white">
              {activeReplyId === null ? (
                <>
                  <textarea
                    className="w-full p-1 pl-2 border rounded-md resize-none bg-white"
                    placeholder="Write a comment..."
                    rows={2}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={handleCancelReply}
                      className="px-3 py-1 border rounded hover:bg-slate/20 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReply}
                      className="px-3 py-1 border rounded bg-minter hover:bg-mint text-sm"
                    >
                      Post Comment
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="text-sm underline text-dark-teal hover:text-teal-700"
                  onClick={() => {
                    setActiveReplyId(null);
                    setReplyContent("");
                  }}
                >
                  Reply to post
                </button>
              )}
            </div>
          )}

          <hr className="my-4 border-black" />

          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-sm underline text-dark-teal hover:text-teal-700"
            >
              {showComments ? "Hide Comments" : "Show Comments"}
            </button>
          </div>

          {showComments && (
            <>
            <h3 className="text-lg font-semibold">Comments</h3>
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
            </>
          )}
        </>
      ) : (
        <p className="text-center text-red-600">Failed to load post.</p>
      )}
    </div>
  );
};

export default PostComp;
