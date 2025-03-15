import React, { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // Firebase import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      // Allow access to login and signup without forcing redirect
      const publicRoutes = ["/login", "/signup"];
      if (!user && !publicRoutes.includes(window.location.pathname)) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Clear user state after logout
      navigate("/login"); // Redirect after sign out
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
