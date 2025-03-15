import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('map'); // Add this line to track active tab
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationsOpen && !event.target.closest('.notification-panel') && 
          !event.target.closest('.notification-button')) {
        setIsNotificationsOpen(false);
      }
      
      if (isProfileOpen && !event.target.closest('.profile-menu') && 
          !event.target.closest('.profile-button')) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationsOpen, isProfileOpen]);
  
  // Sample notifications
  const notifications = [
    { id: 1, text: "New event near Central Park", time: "5 min ago", unread: true },
    { id: 2, text: "Event update: Time changed for Brooklyn Bridge tour", time: "1 hour ago", unread: true },
    { id: 3, text: "Weekend highlights in your area", time: "3 hours ago", unread: false },
  ];

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-[1001] px-4 flex items-center justify-between">
        {/* Center - Logo/Title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-800">MapExplorer</h1>
        </div>
        
        {/* Right side - Notifications and Profile */}
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some(n => n.unread) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {/* Notifications Panel */}
            {isNotificationsOpen && (
              <div className="notification-panel absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                <div className="py-2 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  <button className="text-xs text-blue-600 hover:text-blue-800">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm ${notification.unread ? 'font-medium text-gray-800' : 'text-gray-600'}`}>{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {notification.unread && <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="py-2 px-4 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">View all notifications</button>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </button>
            
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="profile-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Places</a>
                <div className="border-t border-gray-100"></div>
                <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
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
            onClick={() => setActiveTab('map')}
            className={`p-3 rounded-lg ${activeTab === 'map' ? 'bg-purple-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>

          {/* Events Tab */}
          <button 
            onClick={() => setActiveTab('events')}
            className={`p-3 rounded-lg ${activeTab === 'events' ? 'bg-purple-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Vaccination Tab */}
          <button 
            onClick={() => setActiveTab('vaccination')}
            className={`p-3 rounded-lg ${activeTab === 'vaccination' ? 'bg-purple-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </button>

          {/* User Tab */}
          <button 
            onClick={() => setActiveTab('user')}
            className={`p-3 rounded-lg ${activeTab === 'user' ? 'bg-purple-100' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;