import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ContactButton from "./ContactButton"

interface CommunityProps {
  username: string;
  tags: string[];
  profileImg: string;
}

const CommunityComp: React.FC<CommunityProps> = ({
  username,
  tags,
  profileImg,
}) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  const [bio, setBio] = useState<string>("Loading bio...");


useEffect(() => {
  const fetchBio = async () => {
    try {
      const res = await fetch(`http://localhost:8080/profiles/bio/${username}`);

      // If bio is missing (404), just silently set default
      if (res.status === 404) {
        setBio("No bio available.");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch bio");

      const text = await res.text();
      setBio(text || "No bio available.");
    } catch (err) {
      console.warn(`No bio for ${username}. Skipping.`);
      setBio("No bio available.");
    }
  };

  fetchBio();
}, [username]);

  return (
    <div className="flex flex-col h-full w-full bg-light-green border border-black rounded-lg p-4 justify-between">

      {/* Top Content */}
      <div>
        {/* Header */}
        <div className="flex flex-col items-center justify-between">
          <div className="text-3xl pb-5 font-semibold">{username}</div>
          
          <img
            src={profileImg}
            alt={`${username}'s profile`}
            className="h-26 w-26 rounded-full object-cover border border-black"
          />
        </div>

        {bio && (
        <div className="pt-4">
            <p className="text-sm text-gray-800 italic text-center">“{bio}”</p>
        </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm py-1 px-3 bg-offwhite border border-black rounded-full"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm italic text-gray-500">No tags listed</span>
          )}
        </div>
      </div>

      {/* Button at Bottom */}
      <div className="pt-6">
        {!isAuthenticated ? (
          <button
            className="font-fancy cursor-not-allowed text-lg py-1 w-full bg-white border border-black text-black rounded-lg hover:bg-red/50 transition-colors duration-300"
          >
            Log in to Connect
          </button>
        ) :  (
          <ContactButton receiver={username} />
        )}
      </div>
    </div>
  );
};

export default CommunityComp;

