import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Thumb from "/thumb.svg";
import ThumbFill from "/thumb-fill.svg";
import Clock from "/clock.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostPopup from "./PostPopup";

const discourseURL = import.meta.env.VITE_DISCOURSE_URL;

dayjs.extend(relativeTime);

type Comment = {
  commentId: number;
  content: string;
  username: string;
  parentComment: any;
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


const DiscourseComp: React.FC = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");

  const { user } = useContext(AuthContext)!;

  const fetchUserPosts = async () => {
    if (!user?.username) return;

    try {
      const res = await fetch(`${discourseURL}/posts/user/${user.username}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const posts = await res.json();

      const likedPostsRes = await fetch(`${discourseURL}/posts/like/username/${user.username}`);
      const likedPosts: { postId: number }[] = likedPostsRes.ok ? await likedPostsRes.json() : [];
      const likedPostIds = likedPosts.map((entry) => entry.postId);

      const postsWithLikes = await Promise.all(
        posts.map(async (post: Post) => {
          try {
            const likeRes = await fetch(`${discourseURL}/posts/like/postid/${post.id}`);
            if (!likeRes.ok) throw new Error("Failed to fetch likes");
            const allLikes: { postId: number }[] = await likeRes.json();
            const likes = allLikes.filter((like) => like.postId === post.id).length;
            const likedByUser = likedPostIds.includes(post.id);
            return { ...post, likes, likedByUser };
          } catch {
            return { ...post, likes: 0, likedByUser: false };
          }
        })
      );

      setUserPosts(postsWithLikes);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    }
  };

  const fetchUserComments = async () => {
    if (!user?.username) return;

    try {
      const res = await fetch(`${discourseURL}/comments/user/${user.username}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const comments = await res.json();

      const likedCommentsRes = await fetch(`${discourseURL}/comments/like/username/${user.username}`);
      const likedComments: { commentId: number }[] = likedCommentsRes.ok ? await likedCommentsRes.json() : [];
      const likedCommentIds = likedComments.map((entry) => entry.commentId);

      const commentsWithLikes = await Promise.all(
        comments.map(async (comment: Comment) => {
          try {
            const likeRes = await fetch(`${discourseURL}/comments/like/commentid/${comment.commentId}`);
            const allLikes: { commentId: number }[] = likeRes.ok ? await likeRes.json() : [];
            const likes = allLikes.filter((like) => like.commentId === comment.commentId).length;
            const likedByUser = likedCommentIds.includes(comment.commentId);
            return { ...comment, likes, likedByUser };
          } catch {
            return { ...comment, likes: 0, likedByUser: false };
          }
        })
      );

      setUserComments(commentsWithLikes);
    } catch (err) {
      console.error("Error fetching user comments or likes:", err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
    fetchUserComments();
  }, [user?.username]);

  const handleDeletePost = async (postId: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`${discourseURL}/posts/delete/${postId}`, {
        method: "DELETE",
      });
  
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete post");
      }
  
      setUserPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      console.log(`Post ${postId} deleted successfully`);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const togglePostLike = async (post: Post) => {
    if (!user?.username) return;

    const liked = post.likedByUser;
    const url = liked ? `${discourseURL}/posts/unlike` : `${discourseURL}/posts/like`;

    try {
      const res = await fetch(url, {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, postId: post.id }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      // Optimistic update
      setUserPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likes: liked ? (p.likes ?? 1) - 1 : (p.likes ?? 0) + 1,
                likedByUser: !liked,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const toggleCommentLike = async (comment: Comment) => {
    if (!user?.username) return;

    const liked = comment.likedByUser;
    const url = liked
      ? `${discourseURL}/comments/unlike`
      : `${discourseURL}/comments/like`;

    try {
      const res = await fetch(url, {
        method: liked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, commentId: comment.commentId }),
      });

      if (!res.ok) throw new Error("Failed to toggle like");

      // Optimistic update
      setUserComments((prev) =>
        prev.map((c) =>
          c.commentId === comment.commentId
            ? {
                ...c,
                likes: liked ? (c.likes ?? 1) - 1 : (c.likes ?? 0) + 1,
                likedByUser: !liked,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };


  const handleEditPost = async (postId: number, newTitle: string, newContent: string) => {
    try {
      const res = await fetch(`${discourseURL}/posts/update/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
        }),
      });
  
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to update post");
      }
  
      console.log(`Post ${postId} updated successfully`);
      await fetchUserPosts(); // refresh posts after update
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm("Delete this comment?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`${discourseURL}/comments/delete/${commentId}`, {
        method: "DELETE",
      });
  
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete comment");
  
      setUserComments((prev) => prev.filter((c) => c.commentId !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditComment = async (commentId: number, newComment: string) => {
    try {
      const res = await fetch(`${discourseURL}/comments/update/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
        }),
      });
  
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to update comment");
      }
  
      console.log(`Comment ${commentId} updated successfully`);
      await fetchUserComments(); // refresh comments after update
    } catch (err) {
      console.error("Error updating comment:", err);
    }
  };

  const handleSeeThread = async (commentId: number) => {
    try {
      const res = await fetch(`${discourseURL}/comments/${commentId}/post`);
      if (!res.ok) throw new Error("Failed to fetch postId");
      const postId = await res.json();
      setSelectedPostId(postId);
      setSelectedCommentId(commentId); 
    } catch (err) {
      console.error("Error fetching postId:", err);
    }
  };
  

  return (

    <main className="flex flex-col items-center bg-light-green border b-black rounded-lg w-full">

      <div className="bg-mint rounded-t-lg border-b b-black text-center font-fancy py-1 text-xl w-full">
        Discourse Activity 
      </div>

      <div className="flex flex-row w-full">

          {/* Post Section */}
          <div className="w-[50%] flex flex-col gap-2 m-2 text-center">
            <h1 className="font-medium text-lg">Posts</h1>

            <div className="flex flex-col gap-2 pr-1 text-center max-h-130 overflow-y-auto">

            {userPosts.length === 0 ? (
              <p className="italic text-sm mt-4">You haven't made any posts yet.</p>
            ) : (
              userPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border b-black rounded-lg p-2 px-3 text-left"
                >
                  {editingPostId === post.id ? (
                    <>
                      <input
                        className="w-full border border-black rounded p-1 text-sm mb-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Edit title"
                      />
                      <textarea
                        className="w-full border border-black rounded p-1 text-sm"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit content"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="text-sm px-3 py-1 bg-gray-200 border border-black rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleEditPost(post.id, editTitle, editContent);
                            setEditingPostId(null);
                          }}
                          className="text-sm px-3 py-1 bg-mint border border-black rounded hover:bg-minter"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-md font-semibold">{post.title}</p>
                      <p className="text-sm">{post.content}</p>
                    </>
                  )}

                  <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-bold items-end">
                    <div className="flex flex-row items-end text-sm font-medium">
                      <img src={Clock} className="h-5 pr-2" />
                      <span>{dayjs(post.timestamp).fromNow()}</span>
                    </div>


                    <p className="text-sm font-medium">{post.comments.length} Comments</p>

                    <div className="flex flex-row items-end gap-1">
                      <span className="text-sm font-medium">{post.likes ?? 0}</span>
                      <button onClick={() => togglePostLike(post)} className="focus:outline-none">
                        <img
                          src={post.likedByUser ? ThumbFill : Thumb}
                          className="h-5 w-5 object-contain cursor-pointer"
                          alt="Like"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 justify-center mt-3">
                    <button
                      onClick={() => setSelectedPostId(post.id)}
                      className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300"
                    >
                      See Post
                    </button>

                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setEditTitle(post.title);
                        setEditContent(post.content);
                      }}
                      className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-mint hover:bg-minter transition-colors duration-300"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
        </div>
        </div>


        
            <div className="border-r-1 h-145"></div>

        {/* Comment Section */}
        <div className="w-[50%] flex flex-col gap-2 m-2 text-center">

          <h1 className="font-medium text-lg"> Comments </h1>

          <div className="flex flex-col gap-2 pr-1 text-center max-h-130 overflow-y-auto">

          {userComments.length === 0 ? (
            <p className="italic text-sm mt-4">You haven’t commented on anything yet.</p>
          ) : (
            userComments.map((comment) => (
              <div key={comment.commentId} className="bg-white border b-black rounded-lg p-2 px-3 text-left">
                
                {/* Editable or Static Content */}
                {editingCommentId === comment.commentId ? (
                  <>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      className="w-full border border-black rounded p-2 text-sm mt-1"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="px-3 py-1 text-sm border border-black rounded bg-gray-200 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          await handleEditComment(comment.commentId, editComment);
                          setEditingCommentId(null);
                        }}
                        className="px-3 py-1 text-sm border border-black rounded bg-mint hover:bg-minter"
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm">{comment.content}</p>
                )}

                {comment.parentComment && (
                  <div className="mt-1 text-xs italic text-gray-600">
                    Reply to: "{comment.parentComment.content}"
                  </div>
                )}

                <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-medium text-sm items-end">
                  <div className="flex flex-row items-center">
                    <img src={Clock} className="h-5 pr-2" />
                    <span>{comment.timestamp ? dayjs(comment.timestamp).fromNow() : "No timestamp"}</span>
                  </div>
                  <p>{comment.replies?.length ?? 0} Replies</p>
                  <div className="flex flex-row items-center gap-1">
                    <span>{comment.likes ?? 0}</span>
                    <button onClick={() => toggleCommentLike(comment)} className="focus:outline-none">
                        <img
                          src={comment.likedByUser ? ThumbFill : Thumb}
                          className="h-5 w-5 object-contain cursor-pointer"
                          alt="Like"
                        />
                      </button>
                  </div>
                </div>

                <div className="flex flex-row gap-2 justify-center mt-3">
                  <button
                    className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300"
                    onClick={() => handleSeeThread(comment.commentId)}
                  >
                    See Thread
                  </button>

                  <button
                    onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditComment(comment.content);
                    }}
                    className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-mint hover:bg-minter transition-colors duration-300"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>


        {selectedPostId && (
          <PostPopup
            postId={selectedPostId}
            onClose={() => {
              setSelectedPostId(null);
              setSelectedCommentId(null);
              fetchUserPosts();
              fetchUserComments();
            }}
            highlightCommentId={selectedCommentId}
          />
        )}

      </div>



    </main>
  );
};

export default DiscourseComp;