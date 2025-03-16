import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  // Fetch additional user data from Firestore so we can check pregnancy status etc.
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocSnap = await getDoc(doc(db, "users", user.uid));
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data in Navbar:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotificationsOpen &&
        !event.target.closest(".notification-panel") &&
        !event.target.closest(".notification-button")
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        isProfileOpen &&
        !event.target.closest(".profile-menu") &&
        !event.target.closest(".profile-button")
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsOpen, isProfileOpen]);

  // Update the tab click handler
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "map":
        navigate("/");
        break;
      case "events":
        navigate("/events");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-[1001] px-4 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">Sahayak</h1>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <div className="relative">
            <button
              className="notification-button p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {isNotificationsOpen && (
              <div className="notification-panel absolute mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg overflow-hidden z-50 right-0">
                <div className="py-2 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">
                    Notifications
                  </h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 bg-blue-50">
                    <p className="text-sm font-medium text-gray-800">
                      New event near Central Park
                    </p>
                    <p className="text-xs text-gray-500 mt-1">5 min ago</p>
                  </div>
                </div>
                <div className="py-2 px-4 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              className="profile-button flex items-center focus:outline-none"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </button>
            {isProfileOpen && (
              <div className="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <a
                  href="#settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <a
                  href="#favorites"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Saved Places
                </a>
                <div className="border-t border-gray-100"></div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg z-[1001] px-4">
        <div className="flex justify-around items-center h-full">
          {/* Map Tab */}
          <button
            onClick={() => handleTabClick("map")}
            className={`p-3 rounded-lg ${
              location.pathname === "/map" ? "bg-purple-100" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </button>

          {/* Events Tab */}
          <button
            onClick={() => handleTabClick("events")}
            className={`p-3 rounded-lg ${
              activeTab === "events" ? "bg-purple-100" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {/* Conditional Tab: Vaccination for children or Pregnancy Calendar for pregnant women */}
          {userData && userData.userType === "children" ? (
            <Link to="/vaccination" className="flex flex-col items-center p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
              <span className="text-xs">Vaccination</span>
            </Link>
          ) : userData &&
            userData.gender === "Female" &&
            userData.pregnancyStatus === "Pregnant" ? (
            <Link
              to="/pregnancy-calendar"
              className="flex flex-col items-center p-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.055 12.083 12.083 0 015.84 10.578L12 14z"
                />
              </svg>
              <span className="text-xs">Pregnancy</span>
            </Link>
          ) : (
            null
          )}

          {/* Emergency Contacts Tab */}
          <Link
            to="/emergency-contacts"
            className="flex flex-col items-center p-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
