import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/DiscourseSidebar";
import PostComp from "../components/Discourse/PostComp";

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

const DiscoursePage: React.FC = () => {
    const [posts, setPost] = useState<Post[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
    const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("recent");



    const handleTypeChange = (updatedTypes: { [type: string]: boolean }) => {
        setSelectedTypes(updatedTypes);
    };

    const handleProgramChange = (updatedPrograms: { [type: string]: boolean }) => {
        setSelectedPrograms(updatedPrograms);
    };


    const handleClearFilters = () => {
        const clearedTypes = Object.fromEntries(
        Object.keys(selectedTypes).map((key) => [key, false])
        );
    
        const clearedPrograms = Object.fromEntries(
        Object.keys(selectedPrograms).map((key) => [key, false])
        );
    
        setSelectedTypes(clearedTypes);
        setSelectedPrograms(clearedPrograms);
    };


    const fetchPosts = async () => {
        try {
          const res = await fetch("http://localhost:8081/posts");
          if (!res.ok) throw new Error("Failed to fetch posts");
          const data: Post[] = await res.json();
      
          // For each post, fetch the like count
          const enrichedPosts = await Promise.all(
            data.map(async (post) => {
              try {
                const likesRes = await fetch(`http://localhost:8081/posts/like/postid/${post.id}`);
                const likesData = likesRes.ok ? await likesRes.json() : [];
                return { ...post, likes: likesData.length };
              } catch {
                return { ...post, likes: 0 }; // fallback if API fails
              }
            })
          );
      
          setPost(enrichedPosts);
        } catch (err) {
          console.error("Error fetching posts:", err);
        }
      };


    useEffect(() => {
        fetchPosts();
    }, []);

    const selectedTypeLabels = Object.keys(selectedTypes).filter((type) => selectedTypes[type]);
    const selectedProgramLabels = Object.keys(selectedPrograms).filter((program) => selectedPrograms[program]);


    const filteredPosts = posts.filter((post) => {
        const hashtags = (post.title + " " + post.content).match(/#\w[\w-]*/g) || [];
        const normalizedTags = hashtags.map((tag) =>
          tag.toLowerCase().replace(/[^a-z0-9-]/g, "")
        );
      
        const matchesType = selectedTypeLabels.length === 0 || selectedTypeLabels.some((type) =>
          normalizedTags.includes(`#${type.toLowerCase().replace(/\s+/g, "-")}`.replace(/[^a-z0-9-]/g, ""))
        );
      
        const matchesProgram = selectedProgramLabels.length === 0 || selectedProgramLabels.some((program) =>
          normalizedTags.includes(`#${program.toLowerCase().replace(/\s+/g, "-")}`.replace(/[^a-z0-9-]/g, ""))
        );
      
        const lowerSearch = searchTerm.toLowerCase();
        const matchesSearch =
          post.title.toLowerCase().includes(lowerSearch) ||
          post.content.toLowerCase().includes(lowerSearch) ||
          post.username.toLowerCase().includes(lowerSearch);
      
        return matchesType && matchesProgram && matchesSearch;
      });

    
    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortOption === "recent") {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
      
        if (sortOption === "highestRated") {
          return (b.likes ?? 0) - (a.likes ?? 0);
        }
      
        return 0;
      });
      


  return (
    <>
    <Header />
    <main className="flex flex-row min-h-[calc(100vh-150px)] mx-14 py-8 gap-10 ">

      <div className="h-full w-full flex-[20%]">
        <Sidebar 
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            selectedPrograms={selectedPrograms}
            onProgramChange={handleProgramChange}
            onClearFilters={handleClearFilters}
            onSearchChange={setSearchTerm}
         />
      </div>


      <div className="h-full w-full flex-[80%] flex flex-col gap-4">

        <div className="flex justify-start items-center gap-3 mb-0">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1 border border-black rounded-md bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="highestRated">Most Liked</option>
          </select>
        </div>


        <div className="space-y-6">
        {sortedPosts.map((post) => (
            <PostComp key={post.id} postId={post.id} onRefetch={fetchPosts} />
            ))}
        </div>

      </div>

    </main>
    </>
  );
};

export default DiscoursePage;