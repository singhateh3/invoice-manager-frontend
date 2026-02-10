import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AxiosClient from "../axios-client";
import { useStateContext } from "../context/contextProvider";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setToken, setUser } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const { data } = await AxiosClient.post("/login", payload);
      setUser(data.user);
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      const response = err.response;
      
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      } else if (response && response.status === 401) {
        setErrors({ 
          general: ["Invalid email or password"] 
        });
      } else {
        setErrors({ 
          general: ["Something went wrong. Please try again."] 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setErrors(null);

    try {
      // Just redirect to guest page - no login attempt
      navigate("/guest");
    } catch (err) {
      setErrors({ 
        general: ["Unable to enter guest mode. Please try again."] 
      });
      console.error("Guest redirect error:", err);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-xl">
              Sign in to your account to continue
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
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-800 font-medium text-lg"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
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
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 text-lg">Or continue with</span>
              </div>
            </div>

            {/* Guest Mode Button */}
            <button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              className={`mt-6 w-full py-4 px-6 text-xl font-semibold rounded-xl transition ${guestLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'} shadow-sm border-2 border-gray-300`}
            >
              {guestLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mr-3 text-gray-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Entering guest mode...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Continue as Guest
                </div>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-8">
            <p className="text-gray-600 text-lg">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Guest Mode Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-700">
                  <span className="font-medium">Guest Mode:</span> Create invoices without logging in. 
                  Perfect for trying out the service or creating one-time invoices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;