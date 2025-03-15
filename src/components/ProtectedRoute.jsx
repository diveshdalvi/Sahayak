import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Allow access to public routes without redirect
  if (!user && !["/login", "/signup"].includes(location.pathname)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
