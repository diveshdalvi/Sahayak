import React from "react";
import { Outlet, Link } from "react-router-dom";

const Authentication = () => {
  return (
    <div className="text-center p-5">
      <h1 className="text-xl font-bold mb-4">Authentication</h1>
      <nav className="mb-4">
        <Link to="/auth/login" className="mr-4 text-blue-500">
          Login
        </Link>
        <Link to="/auth/signup" className="text-blue-500">
          Signup
        </Link>
      </nav>
      <Outlet /> {/* This will render Login or Signup based on the URL */}
    </div>
  );
};

export default Authentication;
