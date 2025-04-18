import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Profile from "/profile.svg";
import BioPopup from "./BioPopup";

const communityURL = import.meta.env.VITE_COMMUNITY_URL;
const profilesURL = import.meta.env.VITE_PROFILES_URL;

const ProfileComp: React.FC = () => {
  const [bio, setBio] = useState<string>("Loading bio...");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { updateProfilePicture, user } = useContext(AuthContext)!;


  // Fetch profile when user is available
  const fetchProfile = async () => {
    if (!user || !user.username) return;

    try {
      const response = await fetch(`${profilesURL}/profiles/${user.username}`);
      if (!response.ok) throw new Error("Failed to fetch profile.");

      const data = await response.json();
      setBio(data.bio || "No bio available.");

      // get profile tags
      const tagsResponse = await fetch(`${communityURL}/community/get-profile-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user.username }),
      });

      if (!tagsResponse.ok) throw new Error("Failed to fetch profile tags.");
      const tagsData = await tagsResponse.json();
      setTags(tagsData);
      console.log("Tags fetched from server:", tagsData)
      
    } catch (err) {
      setError("Error loading bio.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Function to refresh bio when modal closes
  const handleBioUpdate = () => {
    fetchProfile(); // Re-fetch bio after modal closes
    setIsModalOpen(false); // Close modal
  };

  const handleAddTag = async () => {
    if (!newTag.trim() || !user?.username) return;
  
    try {
      const response = await fetch(`${communityURL}/community/add-profile-tag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: { username: user.username },
          tag: { tag: newTag.trim() },
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add tag.");
      }
  
      console.log("Tag added:", newTag);
      setNewTag("");      
      fetchProfile();     
    } catch (err) {
      console.error("Error adding tag:", err);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    if (!user?.username) return;
  
    try {
      const response = await fetch(`${communityURL}/community/remove-profile-tag`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: { username: user.username },
          tag: { tag: tagToDelete},
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add tag.");
      }
  
      console.log("Tag deleted:", tagToDelete);     
      fetchProfile();     
    } catch (err) {
      console.error("Error deleting tag:", err);
    }
  };

  const handleUpdatePfp = async (file: File) => {  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const res = await fetch(`${profilesURL}/profiles/upload`, {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) throw new Error("Failed to upload profile picture");
  
      const data = await res.text(); // or .json() if your API returns JSON
      const imageUrl = data.trim(); // sanitize just in case
  
      await updateProfilePicture(imageUrl);
      console.log(imageUrl);
    } catch (err) {
      console.error("Error updating profile picture:", err);
      alert("Failed to upload or update your profile picture.");
    }
  };

  function formatGoogleDriveUrl(url: string | null | undefined): string {
    if (!url) return "/profile.svg";
  
    // Extract ID whether it's /uc?export=view&id=... or /file/d/.../view
    const idMatch = url.match(/(?:id=|\/d\/)([\w-]{25,})/);
    const fileId = idMatch ? idMatch[1] : null;
  
    return fileId
      ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
      : "/profile.svg";
  }

  // function formatGoogleDriveUrl(url: string | null | undefined): string {
  //   if (!url) return "/profile.svg";
  
  //   const idMatch = url.match(/(?:id=|\/d\/)([\w-]{25,})/);
  //   const fileId = idMatch ? idMatch[1] : null;
  
  //   return fileId
  //     ? `https://drive.google.com/uc?export=view&id=${fileId}`
  //     : "/profile.svg";
  // }

  console.log(user?.username)
  console.log(user?.profilePictureUrl)
  console.log("formated: " + formatGoogleDriveUrl(user?.profilePictureUrl))


  return (
    <main className="flex flex-col items-center bg-grey-50 border b-black rounded-lg w-full">
      <div className="bg-grey rounded-t-lg border-b b-black text-center font-fancy py-1 text-xl w-full">
        Profile
      </div>

      {/* Main Section */}
      <div className="flex flex-row p-3 gap-3 w-full">
        {/* Picture */}
        <div className="border b-black rounded-lg bg-offwhite p-3 w-[40%] text-center flex flex-col items-center">
          <div className="text-2xl">{user?.username}</div>
          <div>
          <img
               src={user?.profilePictureUrl ? formatGoogleDriveUrl(user.profilePictureUrl) : "/profile.svg"}
              alt="Profile"
              className="h-60 w-60 object-cover rounded-full border border-black"
            />

          </div>
          <label
              htmlFor="pfp-upload"
              className="mt-2 w-[80%] py-1 rounded-lg border b-black cursor-pointer text-sm bg-white hover:bg-purple transition-colors duration-300 text-center"
            >
              Change profile picture
              <input
                id="pfp-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpdatePfp(file);
                }}
              />
            </label>
            <p className="text-xs pt-1">10MB Max file size</p>
        </div>

        {/* Right section */}
        <div className="w-[60%] flex flex-col gap-3 text-center">
          {/* Bio */}
          <div className="bg-offwhite border b-black rounded-lg p-2">
            <h1>Bio</h1>
            <p className="text-sm">
              {bio}
            </p>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 w-[60%] py-1 rounded-lg border b-black cursor-pointer text-sm bg-white hover:bg-purple transition-colors duration-300">
              Edit Bio
            </button>

            {/* Show Bio Update Modal when triggered */}
            {isModalOpen && user && (
              <BioPopup username={user.username} onClose={handleBioUpdate} />
            )}

          </div>

          {/* Tags */}
          <div className="bg-offwhite border b-black rounded-lg p-2 flex flex-col h-full justify-between">
            <div>
              <h1>Tags</h1>
            
              <div className="grid grid-cols-2 gap-1 py-2 pb-auto">
                {tags.length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-2">No tags available.</p>
                ) : (
                  tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 items-center justify-between"
                    >
                      <p className="rounded-full border b-black text-sm w-full bg-white px-2 py-0.5">
                        {tag}
                      </p>
                      <button
                        onClick={() => handleDeleteTag(tag)}
                        className="font-bold text-sm cursor-pointer h-6 w-8 bg-light-red border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300"
                      >
                        ✖
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>


            {/* Add Section */}
            <div className="flex flex-row items-center justify-between gap-2 px-1">
              <p>Add Tag</p>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g. 4th Year"
                className="border border-black w-[70%] bg-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint"
              />
              <button
                onClick={handleAddTag}
                className="cursor-pointer px-3 py-1 bg-mint border border-black text-black rounded-full hover:bg-minter transition-colors duration-300"
              >
                +
              </button>
            </div>

          </div>

        </div>
      </div>

    </main>
  );
};

export default ProfileComp;
