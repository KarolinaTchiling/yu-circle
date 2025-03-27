import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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
  const { isAuthenticated, user } = useContext(AuthContext)!;
  const isOwnProfile = user?.username === username;

  return (
    <div className="flex flex-col h-full w-full bg-light-green border border-black rounded-lg p-6 justify-between">

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
            Log in to Access
          </button>
        ) : isOwnProfile ? null : (
          <button
            className="font-fancy cursor-pointer text-lg py-1 w-full bg-white border border-black text-black rounded-lg hover:bg-minter transition-colors duration-300"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityComp;

