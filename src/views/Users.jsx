import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";
import AxiosClient from "../axios-client";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const handleDelete = (id) => {
    AxiosClient.delete(`/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((user) => user.id !== id));
      })
      .catch((err) => {
        console.error(err);
        alert("failed to delete User");
      });
  };

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
      .catch(console.error);
  };

  useEffect(() => {
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
                      <Link
                        to={`/users/${user.id}/edit`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </Link>

                      <button
                        className="text-red-600 hover:text-red-800 font-medium"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          totalPosts={total}
          postPerPage={postPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Users;
