import React, { useRef, useState } from "react";
import Pagination from "../components/Pagination";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [lastPage, setLastPage] = useState(1);
  const handleDelete = (e) => {
    e.preventDefault();
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-500">Manage and track all users</p>
          </div>

          <Link
            to="/add-user"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
          >
            + New User
          </Link>
        </div>

        {/* Empty State */}
        {users.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <div className="text-4xl mb-3">📄</div>
            <h2 className="text-lg font-semibold text-gray-700">
              No Users yet
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create your first user to get started
            </p>

            <Link
              to="/new-invoice"
              className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Create Invoice
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="p-4 text-left">User Id</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-right">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="p-4 text-gray-700">{user.email}</td>

                      {/* <td className="p-4">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            to={`/invoice/${invoice.id}`}
                            className="text-green-600 hover:underline font-medium"
                          >
                            View
                          </Link>

                          <Link
                            to={`/invoice/${invoice.id}/edit`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(invoice.id)}
                            className="text-red-600 hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Pagination
        totalPosts={lastPage * postPerPage}
        postPerPage={postPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Users;
