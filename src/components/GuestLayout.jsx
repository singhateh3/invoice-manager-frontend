import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ContextProvider, useStateContext } from "../context/contextProvider";

const GuestLayout = () => {
  const { token } = useStateContext();
  if (token) {
    return <Navigate to="/" />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default GuestLayout;
