import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import Profile from "/profile.svg";
import { AuthContext } from "../../context/AuthContext";

const ProfileMenu: React.FC = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { isAuthenticated, user, logout } = useContext(AuthContext)!;

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setDropdownOpen(false); // Function to close dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleNavigate = (path: string) => {
        navigate(path);
        closeDropdown();
    };
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
          ) {
            closeDropdown();
          }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    
    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Icon */}
            <img
                src={Profile}
                alt="Profile"
                className={`h-10 cursor-pointer transition-transform hover:scale-110 ${
                    isDropdownOpen ? 'scale-110' : ''
                }`}
                onClick={toggleDropdown}
            />

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full -right-5 mt-5 bg-white rounded-lg text-black border border-camel shadow-md w-50 z-50">
                    <ul className="flex flex-col text-center">
                        {isAuthenticated ? (
                            // Logged-in dropdown
                            <>
                                <li
                                    className="rounded-t-lg border-b border-black bg-purple"
                                >
                                    <span className="block w-full h-full px-3 py-1">Hi, {user?.username}!</span>
                                </li>
                                <li
                                    className="border-b border-black hover:font-medium hover:bg-purple transition-colors duration-300"
                                    onClick={() => handleNavigate('/dashboard')}
                                >
                                    <span className="block w-full h-full px-3 py-1 cursor-pointer">Account Dashboard</span>
                                </li>
                                <button
                                    className="block w-full h-full px-3 py-1 rounded-b-lg hover:font-medium hover:bg-purple transition-colors duration-300"
                                    onClick={() => {
                                        logout();
                                        closeDropdown();
                                        window.location.href = '/';
                                    }}
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            // Logged-out dropdown
                            <>
                                <li
                                    className="rounded-t-lg border-b border-black hover:font-medium hover:bg-purple transition-colors duration-300"
                                    onClick={() => handleNavigate('/signup')}
                                >

                                    <span className="block w-full h-full px-3 py-1 cursor-pointer">Create an Account</span>
                                </li>
                                <li
                                    className="rounded-b-lg hover:font-medium hover:bg-purple transition-colors duration-300"
                                    onClick={() => handleNavigate('/login')} 
                                >
                                    <span className="block w-full h-full px-3 py-1 cursor-pointer">Log In</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;