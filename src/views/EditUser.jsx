import React, { useEffect, useState } from "react";
import AxiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

const EditUser = () => {
  const { id } = useParams();
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Password_confirmation, setPassword_confirmation] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    setLoading(true);
    AxiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        const user = data.user;
        setName(user.name);
        setEmail(user.email);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const payload = {
      name: Name,
      email: Email,
      password: Password,
      password_confirmation: Password_confirmation,
    };

    AxiosClient.put(`/users/${id}`, payload)
      .then(({ data }) => {
        console.log("User updated:", data);
        navigate(`/users/${id}`);
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        }
      });
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-md border-gray-100 border-2 shadow-lg p-4 mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Edit User
        </h2>

        {Object.keys(errors).length > 0 && (
          <div className="error-alert bg-red-500 text-white p-3 rounded">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        <input
          name="name"
          type="text"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <input
          type="email"
          name="email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <input
          type="password"
          name="password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        <input
          name="password"
          type="password"
          value={Password_confirmation}
          onChange={(e) => setPassword_confirmation(e.target.value)}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
};

export default EditUser;
