import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const NotificationIcon = `${import.meta.env.BASE_URL}notification.svg`;

interface Notification {
  id: number;
  username: string;
  message: string;
  timestamp: string;
}

const NotificationMenu: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDropdown();
  };

  const handleDismiss = (notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  useEffect(() => {
    console.log(
      "NotificationMenu: user =",
      user,
      "isAuthenticated =",
      isAuthenticated
    );
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?.username) {
      axios
        .get(`/notificationProxy/get-notifications/${user.username}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setNotifications(data);
        })
        .catch((err) => {
          console.error("Error fetching notifications:", err);
          setNotifications([]); // fallback to empty array
        });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={NotificationIcon}
        alt="Notifications"
        className={`h-10 cursor-pointer transition-transform hover:scale-110 ${
          isDropdownOpen ? "scale-110" : ""
        }`}
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-md w-64 z-50">
          {isAuthenticated && user && (
            <div className="px-4 py-2 bg-gray-200 text-sm border-b border-gray-300">
              Logged in as: <strong>{user.username}</strong>
            </div>
          )}
          {isAuthenticated ? (
            notifications.length > 0 ? (
              <ul className="list-none p-0 m-0">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="px-4 py-2 flex justify-between items-center border-b border-gray-200"
                  >
                    <div>
                      <div className="text-sm">{notif.message}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(notif.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="text-xs text-red-600 ml-2"
                      onClick={() => handleDismiss(notif.id)}
                    >
                      Dismiss
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-center text-sm">No notifications</div>
            )
          ) : (
            <ul className="list-none p-0 m-0">
              <li
                className="px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={() => handleNavigate("/signup")}
              >
                Create an Account
              </li>
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleNavigate("/login")}
              >
                Log In
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
