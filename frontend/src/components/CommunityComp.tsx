import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ContactButton from "./ContactButton"

const profilesURL = import.meta.env.VITE_PROFILES_URL;


interface CommunityProps {
  username: string;
  tags: string[];
}

const CommunityComp: React.FC<CommunityProps> = ({
  username,
  tags,
}) => {
  const { isAuthenticated } = useContext(AuthContext)!;
  const [bio, setBio] = useState<string>("Loading bio...");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");


useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/profiles/${username}`);
  
        if (!res.ok) throw new Error("Failed to fetch profile");
  
        const data = await res.json();
  
        setBio(data.bio || "No bio available.");
        setProfilePictureUrl(data.profilePictureUrl || ""); 
      } catch (err) {
        console.warn(`No profile for ${username}. Skipping.`, err);
        setBio("No bio available.");
        setProfilePictureUrl(""); // fallback
      }
    };
  
    fetchProfile();
  }, [username]);

  function formatGoogleDriveUrl(url: string | null | undefined): string {
    if (!url) return "/profile.svg";

    // Extract ID whether it's /uc?export=view&id=... or /file/d/.../view
    const idMatch = url.match(/(?:id=|\/d\/)([\w-]{25,})/);
    const fileId = idMatch ? idMatch[1] : null;

    return fileId
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      : "/profile.svg";
  }

  return (
    <div className="flex flex-col h-full w-full bg-light-green border border-black rounded-lg p-4 justify-between">

      {/* Top Content */}
      <div>
        {/* Header */}
        <div className="flex flex-col items-center justify-between">
          <div className="text-3xl pb-2 font-semibold">{username}</div>
          <img
               src={profilePictureUrl ? formatGoogleDriveUrl(profilePictureUrl) : "/profile.svg"}
              alt="Profile"
              className="h-36 w-36 rounded-full object-cover border border-black"
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

