import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/CommunitySidebar";
import CommunityComp from "../components/CommunityComp";

type User = {
  username: string,
  tags: string[]
};


const CommunityPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});
  // const [isFree, setIsFree] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  // const [sortOption, setSortOption] = useState("highestRated");

  // const filteredProducts = products.filter((product) =>
  //   product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const sortedProducts = [...filteredProducts].sort((a, b) => {
  //   if (sortOption === "highestRated") {
  //     return (b.averageRating || 0) - (a.averageRating || 0);
  //   } else if (sortOption === "recent") {
  //     return b.productId - a.productId; // Newest first
  //   }
  //   return 0;
  // });

  // const buildQuery = (
  //   programs: { [type: string]: boolean },
  //   types: { [type: string]: boolean },
  //   isFree: boolean
  // ) => {
  //   const selectedPrograms = Object.keys(programs).filter((key) => programs[key]);
  //   const selectedTypes = Object.keys(types).filter((key) => types[key]);
  
  //   const params = new URLSearchParams();
  
  //   if (selectedPrograms.length > 0) {
  //     params.append("program", selectedPrograms.join(","));
  //   }
  
  //   if (selectedTypes.length > 0) {
  //     params.append("contentType", selectedTypes.join(","));
  //   }

  //   if (isFree) {
  //     params.append("priceType", "free");
  //   }
  
  //   return params.toString();
  // };

  const handleTypeChange = (updatedTypes: { [type: string]: boolean }) => {
    setSelectedTypes(updatedTypes);

    // const query = buildQuery(selectedPrograms, updatedTypes, isFree);
    // fetch(`http://localhost:8083/marketplace/search?${query}`)
    //   .then((res) => res.json())
    //   .then((data) => setProducts(data))
    //   .catch((err) => console.error("Error fetching filtered products:", err));

  };

  const handleProgramChange = (updatedPrograms: { [type: string]: boolean }) => {
    setSelectedPrograms(updatedPrograms);

    // const query = buildQuery(updatedPrograms, selectedTypes, isFree);
    // fetch(`http://localhost:8083/marketplace/search?${query}`)
    //   .then((res) => res.json())
    //   .then((data) => setProducts(data))
    //   .catch((err) => console.error("Error fetching filtered products:", err));

  };

  // const handleIsFreeChange = (free: boolean) => {
  //   setIsFree(free);
  //   const query = buildQuery(selectedPrograms, selectedTypes, free);
  //   fetch(`http://localhost:8083/marketplace/search?${query}`)
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data))
  //     .catch((err) => console.error("Error fetching filtered products:", err));
  // };


  // const handleClearFilters = () => {
  //   const clearedTypes = Object.fromEntries(
  //     Object.keys(selectedTypes).map((key) => [key, false])
  //   );
  
  //   const clearedPrograms = Object.fromEntries(
  //     Object.keys(selectedPrograms).map((key) => [key, false])
  //   );
  
  //   setSelectedTypes(clearedTypes);
  //   setSelectedPrograms(clearedPrograms);
  //   setIsFree(false);
  
  //   // Fetch unfiltered products
  //   fetch("http://localhost:8083/marketplace/products")
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data));
  // };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8082/community/get-default-profiles");
      if (!res.ok) throw new Error("Failed to fetch community users");

      const data = await res.json();
      
      // Transform data to fit <CommunityComp> props
      const transformedUsers = data.map((user: any) => ({
        username: user.username,
        tags: user.tags || [],
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);


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
         />
      </div>


      <div className="h-full w-full flex-[80%] grid grid-cols-3 gap-x-3 gap-y-3">

        {/* <div className="flex justify-start items-center gap-3 mb-0">
          <label htmlFor="sort" className="text-sm font-medium">Sort by:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-1 border border-black rounded-md bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="highestRated">Highest Rated</option>
          </select>
        </div> */}

        {users.map((user, index) => (
          <CommunityComp
            key={index}
            username={user.username}
            tags={user.tags}
            profileImg="/profile.svg" 
          />
        ))}

      </div>


    </main>
    </>
  );
};

export default CommunityPage;