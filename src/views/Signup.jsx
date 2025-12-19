import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosClient from "../axios-client";
import { useStateContext } from "../context/contextProvider";

const Signup = () => {
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const onSubmit = (e) => {
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    e.preventDefault();
    AxiosClient.post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;

        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        if (response && response.status === 401) {
          setErrors(response.data.errors);
        }
      });
  };
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Signup for free
      </h2>
      {errors && (
        <div className="error-alert bg-red-500 text-white p-3 rounded">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      <input
        ref={nameRef}
        type="text"
        placeholder="Full Name"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        ref={emailRef}
        type="email"
        placeholder="Email Address"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        ref={passwordRef}
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        ref={passwordConfirmationRef}
        type="password"
        placeholder="Confirm Password"
        className="w-full px-4 py-3 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        className="w-full bg-blue-600 text-white py-3 rounded-lg 
                     font-semibold hover:bg-blue-700 transition"
      >
        Signup
      </button>

      <p className="text-center text-gray-600">
        Already have an account ?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Signup;
