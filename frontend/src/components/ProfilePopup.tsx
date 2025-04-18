import React, { useContext, useEffect, useState } from 'react'
import Profile from "/profile.svg";
import { AuthContext } from "../context/AuthContext";
import ContactButton from "./ContactButton"

const communityURL = import.meta.env.VITE_COMMUNITY_URL;
const profilesURL = import.meta.env.VITE_PROFILES_URL;

interface ModalProps {
    username: string;
    isOpen: boolean;
    onClose: () => void;
}

type Profile = {
    username: string,
    firstname: string,
    lastname: string,
    bio: string,
    tags: string[],
    pfp: string,
};
  
  
const ProfilePopup: React.FC<ModalProps> = ({ isOpen, onClose, username}) => {

    const [profile, setProfile] = useState<Profile | null>(null);
     const { isAuthenticated, user } = useContext(AuthContext)!;

    useEffect(() => {
        const fetchProfileWithTags = async () => {
          try {
            // Fetch profile
            const profileRes = await fetch(`${profilesURL}/profiles/${username}`);
            if (!profileRes.ok) throw new Error("Failed to fetch profile");
            const profileData = await profileRes.json();
      
            // Fetch tags
            const tagsRes = await fetch(`${communityURL}/community/get-profile-tags`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username }),
            });
            if (!tagsRes.ok) throw new Error("Failed to fetch tags");
            const tags = await tagsRes.json();
      
            // Combine into your defined Profile shape
            const combinedProfile: Profile = {
              username: profileData.username,
              firstname: profileData.firstname,
              lastname: profileData.lastname,
              bio: profileData.bio,
              tags,
              pfp: profileData.profilePictureUrl, // or load a default, or fetch if available elsewhere
            };
      
            setProfile(combinedProfile);
          } catch (err) {
            console.error("Error loading profile:", err);
          }
        };
      
        if (isOpen && username) {
          fetchProfileWithTags();
        }
    }, [isOpen, username]);

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
        <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
         <div className="flex flex-col w-[500px] bg-light-green border border-black rounded-lg p-4 justify-between">
    
          {/* Top Content */}
          <div>
            {/* Header */}
            <div className="flex flex-col items-center justify-between">
              <div className="flex flex-row w-full justify-between">
                <div className="w-8"></div>
                <div className="text-3xl pb-5 font-semibold">{username}</div>
                <button
                    onClick={onClose}
                    className="font-bold text-lg cursor-pointer h-8 w-8 bg-offwhite border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300"
                >
                    ✖
                </button>
              </div>

              <img
                src={profile?.pfp? formatGoogleDriveUrl(profile.pfp) : Profile}
                alt="Profile"
                className="h-65 w-65 rounded-full object-cover border border-black"
              />

              <p className="text-xl pt-3">{profile?.firstname} {profile?.lastname}</p>
            </div>
    
            {profile?.bio && (
            <div className="pt-4">
                <p className="text-sm text-gray-800 italic text-center">“{profile?.bio}”</p>
            </div>
            )}
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-4">
              {profile?.tags && profile.tags.length > 0 ? (
                profile?.tags.map((tag, index) => (
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
          <div className="pt-6 flex gap-4 flex-row">
            <div className="flex-1">
                {!isAuthenticated ? (
                    <button
                    className="font-fancy cursor-not-allowed text-lg py-1 w-full bg-white border border-black text-black rounded-lg hover:bg-red/50 transition-colors duration-300"
                    >
                    Log in to Connect
                    </button>
                ) : user?.username !== username ? (
                    <ContactButton receiver={username} />
                ) : null}
                </div>

            </div>
        </div>

        </div>
      );
    };


export default ProfilePopup
