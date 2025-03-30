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
  const [postIds, setPostIds] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});
//   const [isFree, setIsFree] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("highestRated");


  const buildQuery = (
    programs: { [type: string]: boolean },
    types: { [type: string]: boolean },
    isFree: boolean
  ) => {
    const selectedPrograms = Object.keys(programs).filter((key) => programs[key]);
    const selectedTypes = Object.keys(types).filter((key) => types[key]);
  
    const params = new URLSearchParams();
  
    if (selectedPrograms.length > 0) {
      params.append("program", selectedPrograms.join(","));
    }
  
    if (selectedTypes.length > 0) {
      params.append("contentType", selectedTypes.join(","));
    }

    if (isFree) {
      params.append("priceType", "free");
    }
  
    return params.toString();
  };

  const handleTypeChange = (updatedTypes: { [type: string]: boolean }) => {
    setSelectedTypes(updatedTypes);


  };

  const handleProgramChange = (updatedPrograms: { [type: string]: boolean }) => {
    setSelectedPrograms(updatedPrograms);



  };

//   const handleIsFreeChange = (free: boolean) => {
//     setIsFree(free);

//   };


  const handleClearFilters = () => {
    const clearedTypes = Object.fromEntries(
      Object.keys(selectedTypes).map((key) => [key, false])
    );
  
    const clearedPrograms = Object.fromEntries(
      Object.keys(selectedPrograms).map((key) => [key, false])
    );
  
    setSelectedTypes(clearedTypes);
    setSelectedPrograms(clearedPrograms);
    // setIsFree(false);
  
    // // Fetch unfiltered products
    // fetch("http://localhost:8083/marketplace/products")
    //   .then((res) => res.json())
    //   .then((data) => setProducts(data));
  };



  const fetchPostIds = async () => {
    try {
      const res = await fetch("http://localhost:8081/posts");
      if (!res.ok) throw new Error("Failed to fetch posts");
  
      const data = await res.json();
      const ids = data.map((post: any) => post.id);
  
      setPostIds(ids); // ✅ ACTUALLY update state
      console.log("Post IDs:", ids);
    } catch (err) {
      console.error("Error fetching post IDs:", err);
    }
  };


  useEffect(() => {
    fetchPostIds();
  }, []);

  console.log(postIds)


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
                   
  
            // onClearFilters={handleClearFilters}
            // onSearchChange={setSearchTerm}
         />
      </div>


      <div className="h-full w-full flex-[80%] flex flex-col gap-4">

        <div className="flex justify-start items-center gap-3 mb-0">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            // value={sortOption}
            // onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1 border border-black rounded-md bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="highestRated">Highest Rated</option>
          </select>
        </div>


        <div className="space-y-6">
            {postIds.map((id) => (
                <PostComp key={id} postId={id} />
            ))}
        </div>

      </div>


    </main>
    </>
  );
};

export default DiscoursePage;