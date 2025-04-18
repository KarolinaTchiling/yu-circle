import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const notificationURL = import.meta.env.VITE_NOTIFICATIONS_URL;

const NotificationIcon = `${import.meta.env.BASE_URL}notification.svg`;
const NotificationIconActive = `${import.meta.env.BASE_URL}notification.png`;

interface Notification {
  id: number;
  username: string;
  message: string;
  timestamp: string;
  dismissed?: boolean;
}

const NotificationMenu: React.FC = () => {
  const { user, isAuthenticated } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  const handleNotificationClick = () => {
    if (isAuthenticated) {
      setDropdownOpen((prev) => !prev);
    } else {
      window.location.href = "/signup";
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDropdown();
  };

  // Connects to the delete mapping in the backend to remove a notification.
  const handleDismiss = (notificationId: number) => {
    axios
      .delete(`${notificationURL}/notification/${notificationId}`)
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, message: "deleted", dismissed: true }
              : notification
          )
        );
      })
      .catch((err) => {
        console.error("Error deleting notification:", err);
      });
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
        .get(`${notificationURL}/notification/get-notifications/${user.username}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setNotifications(data);
        })
        .catch((err) => {
          console.error("Error fetching notifications:", err);
          setNotifications([]);
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

  const visibleNotifications = notifications.filter(
    (notification) => !notification.dismissed
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={visibleNotifications.length > 0 ? NotificationIconActive : NotificationIcon}
        alt="Notifications"
        className={`h-10 cursor-pointer transition-transform hover:scale-110 ${
          isDropdownOpen ? "scale-110" : ""
        }`}
        onClick={handleNotificationClick}
      />
      {isDropdownOpen && (
        <div className="absolute top-full -right-30 mt-5 bg-white rounded-lg text-black border shadow-md w-80 z-50">
          {isAuthenticated ? (
            visibleNotifications.length > 0 ? (
              <ul className="list-none p-0 m-0 mr-1 my-2 max-h-100 overflow-y-auto">
                {visibleNotifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="px-4 py-2 flex justify-between items-center border-b border-slate"
                  >
                    <div>
                      <div className="text-sm">{notif.message}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(notif.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <button
                      className="text-xs text-red-600 ml-2 cursor-pointer"
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
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
