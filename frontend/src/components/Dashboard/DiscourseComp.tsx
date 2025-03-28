import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Thumb from "/thumb.svg";
import ThumbFill from "/thumb-fill.svg";
import Clock from "/clock.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PostPopup from "./PostPopup";

dayjs.extend(relativeTime);

type Comment = {
  commentId: number;
  content: string;
  username: string;
  parentComment: any;
  timestamp: string;
  replies: Comment[];
  likes?: number;
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
      const res = await fetch(`http://localhost:8081/posts/user/${user.username}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const posts = await res.json();
  
      // Fetch likes for each post
      const postsWithLikes = await Promise.all(
        posts.map(async (post: Post) => {
          try {
            const likeRes = await fetch(`http://localhost:8081/posts/like/postId/${post.id}`);
            const likes = likeRes.ok ? await likeRes.json() : 0;
            return { ...post, likes };
          } catch {
            return { ...post, likes: 0 };
          }
        })
      );
  
      setUserPosts(postsWithLikes);
    } catch (err) {
      console.error("Error fetching user posts or likes:", err);
    }
  };

  const fetchUserComments = async () => {
    if (!user?.username) return;
  
    try {
      const res = await fetch(`http://localhost:8081/comments/user/${user.username}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const comments = await res.json();
  
      // Fetch likes for each comment
      const commentsWithLikes = await Promise.all(
        comments.map(async (comment: Comment) => {
          try {
            const likeRes = await fetch(`http://localhost:8081/comments/like/commentId/${comment.commentId}`);
            const likes = likeRes.ok ? await likeRes.json() : 0;
            return { ...comment, likes };
          } catch {
            return { ...comment, likes: 0 };
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
      const res = await fetch(`http://localhost:8081/posts/delete/${postId}`, {
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

  const handleEditPost = async (postId: number, newTitle: string, newContent: string) => {
    try {
      const res = await fetch(`http://localhost:8081/posts/update/${postId}`, {
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
      const res = await fetch(`http://localhost:8081/comments/delete/${commentId}`, {
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
      const res = await fetch(`http://localhost:8081/comments/update/${commentId}`, {
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
      const res = await fetch(`http://localhost:8081/comments/${commentId}/post`);
      if (!res.ok) throw new Error("Failed to fetch postId");
      const postId = await res.json();
      setSelectedPostId(postId);
      setSelectedCommentId(commentId); // optional, if you want to scroll/highlight
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

                    <div className="flex flex-row items-end">
                      <span className="text-sm font-medium">{post.likes ?? 0}</span>
                      <img src={Thumb} className="h-6 pl-1" />
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


        
            <div className="border-r-1"></div>

        {/* Comment Section */}
        <div className="w-[50%] flex flex-col gap-2 m-2 text-center">

          <h1 className="font-medium text-lg"> Comments </h1>

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
                  <div className="flex flex-row items-center">
                    <span>{comment.likes ?? 0}</span>
                    <img src={Thumb} className="h-6 pl-2" />
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


        {selectedPostId && (
          <PostPopup
            postId={selectedPostId}
            onClose={() => {
              setSelectedPostId(null);
              setSelectedCommentId(null);
            }}
            highlightCommentId={selectedCommentId}
          />
        )}
        
      </div>


    </main>
  );
};

export default DiscourseComp;