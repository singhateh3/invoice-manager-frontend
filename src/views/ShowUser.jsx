import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosClient from "../axios-client";
import Spinner from "../components/Spinner";

const ShowUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data.user);
        console.log(data.user);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>

      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        {user.roles && (
          <div>
            <strong>Roles:</strong>
            <div className="flex gap-2 mt-1">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowUser;
