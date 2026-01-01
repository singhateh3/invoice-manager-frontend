import React, { useRef, useState } from "react";

const AddUser = () => {
  const [errors, setErrors] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="max-w-md border-gray-100 border-2 shadow-lg p-4 mx-auto">
      <form onSubmit={onSubmit} className="space-y-4 ">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add a new Users
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
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
