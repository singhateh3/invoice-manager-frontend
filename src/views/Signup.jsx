import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosClient from "../axios-client";
import { useStateContext } from "../context/contextProvider";

const Signup = () => {
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    AxiosClient.post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        navigate("/dashboard");
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else if (response && response.status === 401) {
          setErrors(response.data.errors);
        } else {
          setErrors({ 
            general: ["Something went wrong. Please try again."] 
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Create Your Account
            </h1>
            <p className="text-gray-600 text-xl">
              Sign up to start creating professional invoices
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            
            {/* Error Messages */}
            {errors && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    {errors.general ? (
                      <p className="text-red-700 font-medium">{errors.general[0]}</p>
                    ) : (
                      Object.keys(errors).map((key) => (
                        <p key={key} className="text-red-700 font-medium">
                          {errors[key][0]}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Two-column layout for Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  ref={nameRef}
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Email Address
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Two-column layout for Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Password Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Password
                </label>
                <input
                  ref={passwordRef}
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <p className="mt-2 text-gray-500 text-sm">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  Confirm Password
                </label>
                <input
                  ref={passwordConfirmationRef}
                  type="password"
                  required
                  placeholder="Confirm your password"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 text-xl font-semibold rounded-xl transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-md`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Terms & Conditions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-700 text-sm">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="font-medium hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="font-medium hover:underline">Privacy Policy</a>.
                  Your invoices will be saved and accessible anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center pt-8 border-t border-gray-200 mt-8">
            <p className="text-gray-600 text-lg">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;