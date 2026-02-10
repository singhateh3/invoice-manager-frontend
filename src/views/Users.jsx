import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link, useNavigate } from "react-router-dom";
import AxiosClient from "../axios-client";
import Modal from "../components/Modal";
import EditUser from "./EditUser";
import ShowUser from "./ShowUser";
import Spinner from "../components/Spinner";
import { 
  HiOutlineEye, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineUserAdd, 
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineXCircle
} from "react-icons/hi";
import { useStateContext } from "../context/contextProvider";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Simplified permission check - just check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [editingUserId, setEditingUserId] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user: currentUser, setUser: setCurrentUser } = useStateContext();

  const handleDelete = () => {
    if (!userToDelete) return;

    // Prevent deleting yourself
    if (currentUser?.id === userToDelete) {
      alert("You cannot delete your own account");
      setShowDeleteModal(false);
      setUserToDelete(null);
      return;
    }

    AxiosClient.delete(`/users/${userToDelete}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
        setTotal((prev) => prev - 1);
        setShowDeleteModal(false);
        setUserToDelete(null);
        
        // If we're on the last page and it becomes empty, go back a page
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert(err.response?.data?.message || "You don't have permission to delete users");
        } else {
          alert("Failed to delete user");
        }
      });
  };

  // Fetch all users for admin, only current user for non-admin
  const fetchUsers = () => {
    setLoading(true);
    setError(null);

    AxiosClient.get(`/users?page=${currentPage}`)
      .then(({ data }) => {
        console.log("Users data:", data); // Debug log
        
        // Check if user is admin
        const userIsAdmin = data.is_admin || 
                           data.can_manage_all || 
                           (data.permissions && data.permissions.can_manage_users) ||
                           currentUser?.hasRole?.('admin') || 
                           currentUser?.is_admin || 
                           false;
        
        setIsAdmin(userIsAdmin);
        
        if (userIsAdmin) {
          // Admin sees all users with pagination
          setUsers(data.data || []);
          setLastPage(data.meta?.last_page || 1);
          setPostPerPage(data.meta?.per_page || 10);
          setTotal(data.meta?.total || 0);
        } else {
          // Non-admin only sees their own profile
          if (currentUser) {
            setUsers([currentUser]);
            setTotal(1);
            setLastPage(1);
            setPostPerPage(1);
          } else {
            // If no current user, try to fetch it
            AxiosClient.get('/user/profile')
              .then(({ data }) => {
                setUsers([data.user]);
                setTotal(1);
                setLastPage(1);
                setPostPerPage(1);
              })
              .catch(() => {
                setUsers([]);
                setTotal(0);
              });
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        if (err.response?.status === 403) {
          setError("You don't have permission to view users");
          // Non-admin users should still see their own profile
          if (currentUser) {
            setUsers([currentUser]);
            setTotal(1);
            setLastPage(1);
            setPostPerPage(1);
          }
        } else {
          setError("Failed to load users. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, currentUser]);

  // Update current user when editing own profile
  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    
    // If the updated user is the current user, update context
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  // Add new user to list (for admin)
  const handleUserAdded = (newUser) => {
    if (isAdmin) {
      setUsers((prev) => [newUser, ...prev]);
      setTotal((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAdmin ? "Users Management" : "My Profile"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAdmin ? (
                `${total} ${total === 1 ? 'user' : 'users'} in total`
              ) : (
                "View and manage your profile information"
              )}
            </p>
          </div>
          
          {/* Show "Add New User" button only for admin */}
          {isAdmin && (
            <Link
              to="/add-user"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              <HiOutlineUserAdd className="w-5 h-5" />
              Add New User
            </Link>
          )}
        </div>

        {/* Admin Badge */}
        {isAdmin && (
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 border border-purple-200 rounded-full text-sm font-medium">
              <HiOutlineShieldCheck className="w-4 h-4 mr-2" />
              Administrator - Full Access
            </span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <HiOutlineXCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {users.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <HiOutlineUser className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {isAdmin ? "No Users Found" : "No User Data"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {isAdmin 
                ? "There are no users in the system yet. Add your first user to get started."
                : "Unable to load your profile information. Please try again."
              }
            </p>
            {isAdmin && (
              <Link
                to="/add-user"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
              >
                <HiOutlineUserAdd className="w-5 h-5" />
                Add First User
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      {isAdmin && (
                        <>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Created
                          </th>
                        </>
                      )}
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => {
                      const userIsAdmin = user.roles?.some(role => role.name === 'admin') || 
                                         user.is_admin || 
                                         user.hasRole?.('admin') || 
                                         false;
                      
                      return (
                        <tr 
                          key={user.id} 
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{user.id}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  userIsAdmin
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-700'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-700'
                                }`}>
                                  {user.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                  {currentUser?.id === user.id && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      You
                                    </span>
                                  )}
                                </div>
                                {!isAdmin && (
                                  <div className="text-sm text-gray-500">
                                    Your account
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          
                          {isAdmin && (
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  userIsAdmin
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {userIsAdmin ? 'Administrator' : 'Standard User'}
                                </span>
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                            </>
                          )}
                          
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewUserId(user.id)}
                                className="inline-flex items-center p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="View User"
                              >
                                <HiOutlineEye className="w-5 h-5" />
                              </button>
                              
                              {/* Allow editing for admin or for own profile */}
                              {(isAdmin || currentUser?.id === user.id) && (
                                <button
                                  onClick={() => setEditingUserId(user.id)}
                                  className="inline-flex items-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit User"
                                >
                                  <HiOutlinePencil className="w-5 h-5" />
                                </button>
                              )}
                              
                              {/* Only admin can delete, and they can't delete themselves */}
                              {isAdmin && currentUser?.id !== user.id && (
                                <button
                                  onClick={() => {
                                    setUserToDelete(user.id);
                                    setShowDeleteModal(true);
                                  }}
                                  className="inline-flex items-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete User"
                                >
                                  <HiOutlineTrash className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination - Only for admin */}
            {isAdmin && lastPage > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <Pagination
                  totalPosts={total}
                  postPerPage={postPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={lastPage}
                />
              </div>
            )}
          </>
        )}

        {/* View User Modal */}
        {viewUserId && (
          <Modal onClose={() => setViewUserId(null)}>
            <ShowUser 
              userId={viewUserId} 
              onClose={() => setViewUserId(null)} 
              isAdmin={isAdmin}
            />
          </Modal>
        )}

        {/* Edit User Modal */}
        {editingUserId && (
          <Modal onClose={() => setEditingUserId(null)}>
            <EditUser
              userId={editingUserId}
              onUpdated={handleUserUpdated}
              onClose={() => setEditingUserId(null)}
              isAdmin={isAdmin}
              currentUserId={currentUser?.id}
            />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <HiOutlineTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Delete User</h2>
                  <p className="text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="mb-8 text-gray-700">
                Are you sure you want to delete this user? All their data will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:opacity-90 transition shadow-md"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;