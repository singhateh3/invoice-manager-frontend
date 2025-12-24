import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import AxiosClient from "../axios-client";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

const DefaultLayout = () => {
  const { token, user, setUser, setToken } = useStateContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  if (!token) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    try {
      await AxiosClient.post("/logout");
      setUser(null);
      setToken(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Users", path: "/users" },
    { name: "Invoices", path: "/invoices" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md p-6 space-y-6 fixed h-screen">
        <div className="text-2xl font-bold text-blue-600">My Admin</div>
        <nav className="flex flex-col space-y-3 mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <aside className="relative w-64 bg-white shadow-md p-6">
            <button
              className="absolute top-4 right-4 text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
            <div className="text-2xl font-bold text-blue-600 mb-6">
              My Admin
            </div>
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-all"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenuAlt3 />
            </button>
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {/* Logout button */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-auto flex-1">
          <Outlet />
        </main>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
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
