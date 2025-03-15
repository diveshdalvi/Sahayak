import React from "react";
import { Outlet } from "react-router-dom";

const Authentication = () => {
  return (
    <div>
      <h2>Authentication Page</h2>
      <Outlet />
    </div>
  );
};

export default Authentication;
