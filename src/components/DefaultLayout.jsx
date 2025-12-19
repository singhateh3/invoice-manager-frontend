import React, { useState } from "react";
import { useStateContext } from "../context/contextProvider";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import AxiosClient from "../axios-client";

const DefaultLayout = () => {
  const { token, user, setUser, setToken } = useStateContext();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  if (!token) {
    return <Navigate to="/login" />;
  }
  const handleLogout = async () => {
    try {
      await AxiosClient.post("/logout").then(() => {
        setUser({});
        setToken(null);
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 shadow-lg flex flex-col p-6 space-y-6 fixed h-screen">
        <div className="text-2xl font-bold text-blue-600">My Admin</div>
        <nav className="flex flex-col space-y-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/users"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
          >
            Users
          </Link>
          <Link
            to="/new-invoice"
            className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
          >
            Invoice
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col mx-auto">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>

          <div className="flex items-center space-x-4">
            {/* avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            {/* logout button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-centerx z-50 justify-center">
            <div className="rounded-lg w-96 bg-white p-6 h-48">
              <h2 className="text-lg mb-4 font-semibold">Confirm Logout</h2>
              <p className="mb-6">Are you youre you wanna logout?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefaultLayout;
