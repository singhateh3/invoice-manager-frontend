import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import AxiosClient from "../axios-client";
import { HiOutlineMenuAlt3, HiOutlineLogout, HiOutlineHome, HiOutlineDocumentText, HiOutlineUsers } from "react-icons/hi";

const DefaultLayout = () => {
  const { token, user, setUser, setToken } = useStateContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.roles?.includes("admin");

  if (!token) navigate("/login");

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
    { name: "Dashboard", path: "/dashboard", icon: <HiOutlineHome className="w-5 h-5" /> },
    { name: "Invoices", path: "/invoices", icon: <HiOutlineDocumentText className="w-5 h-5" /> },
    ...(isAdmin ? [{ name: "Users", path: "/users", icon: <HiOutlineUsers className="w-5 h-5" /> }] : []),
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-6 h-screen sticky top-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">IM</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Invoice</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-all hover:shadow-sm"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <aside className="relative w-72 bg-white h-full shadow-xl p-6 animate-slide-in">
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">IM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">InvoicePro</h1>
            </div>
            
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 active:bg-blue-50 hover:text-blue-600 active:text-blue-600 font-medium transition-all"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium"
              >
                <HiOutlineLogout className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineMenuAlt3 className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>

          {/* User profile for large screens (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500">{isAdmin ? "Administrator" : "User"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <HiOutlineLogout className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Confirm Logout</h2>
                <p className="text-gray-600">Are you sure you want to sign out?</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:opacity-90 transition shadow-md"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DefaultLayout;