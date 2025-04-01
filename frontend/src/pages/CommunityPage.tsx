import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebars/CommunitySidebar";
import CommunityComp from "../components/CommunityComp";

const communityURL = import.meta.env.VITE_COMMUNITY_URL;

type User = {
  username: string,
  tags: string[]
};


const CommunityPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<{ [type: string]: boolean }>({});
  const [selectedPrograms, setSelectedPrograms] = useState<{ [type: string]: boolean }>({});
  const [isRecommended, setIsRecommended] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { user } = useContext(AuthContext)!;

  const filteredUsers = searchTerm
  ? users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  : users;


  const buildTagQuery = (
    programs: { [type: string]: boolean },
    types: { [type: string]: boolean }
  ) => {
    const selectedPrograms = Object.keys(programs).filter((key) => programs[key]);
    const selectedTypes = Object.keys(types).filter((key) => types[key]);

    const params = new URLSearchParams();

    selectedPrograms.forEach((tag) => params.append("programs", tag));
    selectedTypes.forEach((tag) => params.append("types", tag));

    return params.toString(); // ?programs=Health&programs=Science&types=Mentor&types=Mentee
  };


  const fetchFilteredCommunityUsers = async (
    programs: { [type: string]: boolean },
    types: { [type: string]: boolean }
  ) => {
    const query = buildTagQuery(programs, types);

    if (!query) {
      isRecommended ? fetchRecUsers() : fetchAllUsers();
      return;
    }

    if (isRecommended) {
      fetchRecUsers(); // ignore filters if recommended selected
      return;
    }

    try {
      const res = await fetch(`${communityURL}/community/filter?${query}`);
      if (!res.ok) throw new Error("Failed to fetch filtered users");

      const data = await res.json();

      const transformedUsers = data.map((user: any) => ({
        username: user.username,
        tags: user.tags || [],
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching filtered users:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${communityURL}/community/get-default-profiles`);
      if (!res.ok) throw new Error("Failed to fetch community users");

      const data = await res.json();

      const transformedUsers = data.map((user: any) => ({
        username: user.username,
        tags: user.tags || [],
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRecUsers = async () => {
    try {
      const res = await fetch(`${communityURL}/community/get-recommended-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: user!.username
        })
      });

      if (!res.ok) throw new Error("Failed to fetch recommended users");

      const data = await res.json();

      const transformedUsers = data.map((user: any) => ({
        username: user.username,
        tags: user.tags || [],
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Error fetching recommended users:", err);
    }
  };

  const handleTypeChange = (updatedTypes: { [type: string]: boolean }) => {
    setSelectedTypes(updatedTypes);
    fetchFilteredCommunityUsers(selectedPrograms, updatedTypes);
  };

  const handleProgramChange = (updatedPrograms: { [type: string]: boolean }) => {
    setSelectedPrograms(updatedPrograms);
    fetchFilteredCommunityUsers(updatedPrograms, selectedTypes);
  };

  const handleIsRecommended = (value: boolean) => {
    setIsRecommended(value);
    value ? fetchRecUsers() : fetchFilteredCommunityUsers(selectedPrograms, selectedTypes);
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
  
    fetchFilteredCommunityUsers(clearedPrograms, clearedTypes);
  };


  useEffect(() => {
    if (isRecommended) {
      fetchRecUsers();
    } else {
      fetchFilteredCommunityUsers(selectedPrograms, selectedTypes);
    }
  }, [isRecommended]);



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
            onSearchChange={setSearchTerm}
            isRecommended={isRecommended}                     
            setIsRecommended={handleIsRecommended}  
            onClearFilters={handleClearFilters}
         />
      </div>


      <div className="h-full w-full flex-[80%] grid grid-cols-3 gap-x-3 gap-y-3">
        {filteredUsers
          .filter((u) => u.username !== user?.username) // skip own profile
          .map((user, index) => (
            <CommunityComp
              key={index}
              username={user.username}
              tags={user.tags}
            />
        ))}
      </div>


    </main>
    </>
  );
};

export default CommunityPage;