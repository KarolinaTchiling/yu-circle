import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Profile from "/profile.svg";
import BioPopup from "./BioPopup";


const ProfileComp: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [bio, setBio] = useState<string>("Loading bio...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!authContext) {
    return <p>Loading profile...</p>;
  }
  const { user } = authContext;

  // Fetch profile when user is available
  const fetchProfile = async () => {
    if (!user || !user.username) return;

    try {
      const response = await fetch(`http://localhost:8080/profiles/${user.username}`);
      if (!response.ok) throw new Error("Failed to fetch profile.");

      const data = await response.json();
      setBio(data.userBio || "No bio available.");
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
            <img src={Profile} className="h-60" />
          </div>
          <button className="mt-2 w-[80%] py-1 rounded-lg border b-black cursor-pointer text-sm bg-white hover:bg-purple transition-colors duration-300">
            Change profile picture
          </button>
        </div>

        {/* Right section */}
        <div className="w-[60%] flex flex-col gap-3 text-center">
          {/* Bio */}
          <div className="bg-offwhite border b-black rounded-lg p-2">
            <h1>Bio</h1>
            <p className="text-sm">
              {loading ? "Loading bio..." : error ? error : bio}
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
          <div className="bg-offwhite border b-black rounded-lg p-2 h-1/2 flex flex-col justify-between">
            <h1>Tags</h1>
            <div className="grid grid-cols-2 gap-1 py-2 pb-auto">
              <div className="flex flex-row gap-2 items-center">
                <p className="rounded-full border b-black text-sm bg-white px-2 py-0.5">Mentor</p>
                <button className="font-bold text-sm cursor-pointer h-6 w-6 bg-light-red border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300">
                  ✖
                </button>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <p className="rounded-full border b-black text-sm bg-white px-2 py-0.5">4th Year</p>
                <button className="font-bold text-sm cursor-pointer h-6 w-6 bg-light-red border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300">
                  ✖
                </button>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <p className="rounded-full border b-black text-sm bg-white px-2 py-0.5">Career Focus</p>
                <button className="font-bold text-sm cursor-pointer h-6 w-6 bg-light-red border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300">
                  ✖
                </button>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <p className="rounded-full border b-black text-sm bg-white px-2 py-0.5">Comp Sci</p>
                <button className="font-bold text-sm cursor-pointer h-6 w-6 bg-light-red border border-black text-black rounded-full hover:bg-red/50 transition-colors duration-300">
                  ✖
                </button>
              </div>
            </div>

            {/* Add Section */}
            <div className="flex flex-row items-center justify-between gap-2 px-1">
              <p>Add Tag</p>
              <input
                type="text"
                placeholder=""
                className="border border-black w-[70%] bg-white rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-mint"
              />
              <button className="cursor-pointer px-3 py-1 bg-mint border border-black text-black rounded-full hover:bg-minter transition-colors duration-300">
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
