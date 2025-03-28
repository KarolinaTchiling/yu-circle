import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Thumbs from "/thumbs.svg";
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
};

type Post = {
  id: number;
  title: string;
  content: string;
  username: string;
  timestamp: string;
  comments: Comment[];
};


const DiscourseComp: React.FC = () => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const { user } = useContext(AuthContext)!;
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user?.username) return;

      try {
        const res = await fetch(`http://localhost:8081/posts/user/${user.username}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setUserPosts(data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    fetchUserPosts();
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

  console.log(userPosts);

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
                <p className="text-md font-semibold">{post.title}</p>
                <p className="text-sm">{post.content}</p>

                <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-bold items-end">
                  <div className="flex flex-row items-end text-sm font-medium">
                    <img src={Clock} className="h-5 pr-2" />
                    <span>{dayjs(post.timestamp).fromNow()}</span>
                  </div>

                  <p className="text-sm font-medium">{post.comments.length} Comments</p>

                  <div className="flex flex-row items-end">
                    <span className="text-sm font-bold">2</span>
                    <img src={Thumbs} className="h-6 pl-1" />
                  </div>
                </div>

                <div className="flex flex-row gap-2 justify-center mt-3">
                  <button 
                    onClick={() => setSelectedPostId(post.id)}
                    className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300">
                    See Post
                  </button>

                  {selectedPostId && (
                    <PostPopup postId={selectedPostId} onClose={() => setSelectedPostId(null)} />
                  )}

                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300">
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

          {/* Comment Bubble*/}
          <div className="bg-white border b-black rounded-lg p-2 px-3 text-left">
              <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam sapien, sollicitudin non ipsum non, commodo congue risus.
              </p>

              <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-bold">

                <p>
                  0 Comments
                </p>  

                <div className="flex flex-row items-end">
                  <span> 2 </span>
                  <img src={Thumbs} className="h-7 pl-2"/>
                </div>

              </div>
              <div className="flex flex-row gap-2 justify-center mt-2">
                <button className=" w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300">
                See Comment 
                </button>

                <button className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300">
                Delete
                </button>
              </div>
          </div>

          {/* Comment Bubble*/}
          <div className="bg-white border b-black rounded-lg p-2 px-3 text-left">
              <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam sapien, sollicitudin non ipsum non, commodo congue risus.
              </p>

              <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-bold">

                <p>
                  0 Comments
                </p>  

                <div className="flex flex-row items-end">
                  <span> 2 </span>
                  <img src={Thumbs} className="h-7 pl-2"/>
                </div>

              </div>
              <div className="flex flex-row gap-2 justify-center mt-2">
                <button className=" w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300">
                See Comment 
                </button>

                <button className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300">
                Delete
                </button>
              </div>
          </div>

          {/* Comment Bubble*/}
          <div className="bg-white border b-black rounded-lg p-2 px-3 text-left">
              <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam sapien, sollicitudin non ipsum non, commodo congue risus.
              </p>

              <div className="flex flex-row gap-2 justify-between mt-2 mx-1 font-bold">

                <p>
                  0 Comments
                </p>  

                <div className="flex flex-row items-end">
                  <span> 2 </span>
                  <img src={Thumbs} className="h-7 pl-2"/>
                </div>

              </div>
              <div className="flex flex-row gap-2 justify-center mt-2">
                <button className=" w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-purple hover:bg-bright-purple transition-colors duration-300">
                See Comment 
                </button>

                <button className="w-full py-0.5 rounded-lg border b-black cursor-pointer text-sm bg-light-red hover:bg-red/40 transition-colors duration-300">
                Delete
                </button>
              </div>
          </div>
          
        </div>
        
      </div>


    </main>
  );
};

export default DiscourseComp;