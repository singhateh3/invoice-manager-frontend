import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import AxiosClient from "../axios-client";
import Modal from "../components/Modal";
import EditUser from "./EditUser";
import editIcon from "../assets/images/pen.png";
import viewIcon from "../assets/images/eye.png";
import deleteIcon from "../assets/images/delete.png";
import ShowUser from "./ShowUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [editingUserId, setEditingUserId] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    if (!userToDelete) return;

    AxiosClient.delete(`/users/${userToDelete}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== userToDelete));
        setTotal((prev) => prev - 1);
        setShowDeleteModal(false);
        setUserToDelete(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to delete invoice");
      });
  };

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);

      AxiosClient.get(`/users?page=${currentPage}`)
        .then(({ data }) => {
          setUsers(data.data);
          setLastPage(data.meta.last_page);
          setPostPerPage(data.meta.per_page);
          setTotal(data.meta.total);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchUsers();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Users</h1>
          <Link
            to="/add-user"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + New User
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      #{user.id}
                    </td>

                    <td className="px-6 py-4 text-gray-700">{user.name}</td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4 text-right space-x-4">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => setViewUserId(user.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-50 transition border-2 p-2"
                        >
                          <img
                            src={viewIcon}
                            alt="view"
                            className="w-4 h-4 object-contain"
                          />
                        </button>
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-50 transition border-2 p-2"
                        >
                          <img
                            src={editIcon}
                            alt="Edit"
                            className="w-4 h-4 object-contain"
                          />
                        </button>

                        <button
                          onClick={() => {
                            setUserToDelete(user.id);
                            setShowDeleteModal(true);
                          }}
                          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition border-2 p-2"
                        >
                          <img
                            src={deleteIcon}
                            alt="delete"
                            className="w-4 h-4 object-contain"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          totalPosts={lastPage * postPerPage}
          postPerPage={postPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        {viewUserId && (
          <Modal onClose={() => setViewUserId(null)}>
            <ShowUser userId={viewUserId} onClose={() => setViewUserId(null)} />
          </Modal>
        )}
        {editingUserId && (
          <Modal onClose={() => setEditingUserId(null)}>
            <EditUser
              userId={editingUserId}
              onUpdated={(updatedUser) =>
                setUsers((prev) =>
                  prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
                )
              }
              onClose={() => setEditingUserId(null)}
            />
          </Modal>
        )}
        {/* show delete modal  */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4 text-red-600">
                Confirm Delete
              </h2>

              <p className="mb-6">
                Are you sure you want to delete this User? This action cannot be
                undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
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
