import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "/chat.svg";

const ChatMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const checkLoggedIn = Boolean(true);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setDropdownOpen(false); // Function to close dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDropdown();
  };

  // Add event listener to detect outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) // Click is outside the dropdown
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon */}
      <img
        src={Chat}
        alt="Chat"
        className={`h-10 cursor-pointer transition-transform hover:scale-110 ${
          isDropdownOpen ? "scale-110" : ""
        }`}
        onClick={toggleDropdown}
      />

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-full -right-18 mt-5 bg-white rounded-lg text-black border border-camel shadow-md w-80 z-50">
          <ul className="flex flex-col text-center">
            {checkLoggedIn ? (
              // Logged-in dropdown
              <>
                <li className="rounded-t-lg border-b border-black py-1 hover:font-medium hover:bg-purple transition-colors duration-300">
                  Message
                </li>
                <li className="block w-full h-full border-b border-black px-3 py-1 hover:font-medium hover:bg-purple transition-colors duration-300">
                  Message
                </li>
                <li className="block w-full h-full border-b border-black px-3 py-1 hover:font-medium hover:bg-purple transition-colors duration-300">
                  Message
                </li>
                <li className="block w-full h-full px-3 py-1 rounded-b-lg hover:font-medium hover:bg-purple transition-colors duration-300">
                  Message
                </li>
              </>
            ) : (
              // Logged-out dropdown
              <>
                <li
                  className="rounded-t-lg border-b border-black hover:font-medium hover:bg-purple transition-colors duration-300"
                  onClick={() => handleNavigate("/signup")}
                >
                  <span className="block w-full h-full px-3 py-1 cursor-pointer">
                    Create an Account
                  </span>
                </li>
                <li
                  className="rounded-b-lg hover:font-medium hover:bg-purple transition-colors duration-300"
                  onClick={() => handleNavigate("/login")}
                >
                  <span className="block w-full h-full px-3 py-1 cursor-pointer">
                    Log In
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatMenu;
