import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* LEFT SIDE - same */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">SL</div>
            <span className="text-2xl font-bold">SchoolLink</span>
          </div>
          <div className="mt-16">
            <h1 className="text-4xl font-bold mb-4">Welcome to SchoolLink</h1>
            <p className="text-blue-100 text-lg mb-6">The Complete School Management Platform</p>
            <p className="text-blue-200 text-sm max-w-md">
              Unifying administration, teaching, and learning in one powerful,
              beautifully designed platform.
            </p>
          </div>
        </div>
        <div className="flex gap-8 text-sm">
          <div><span className="block text-2xl font-bold">1,200+</span><span className="text-blue-200">Students</span></div>
          <div><span className="block text-2xl font-bold">80+</span><span className="text-blue-200">Teachers</span></div>
          <div><span className="block text-2xl font-bold">95%</span><span className="text-blue-200">Satisfaction</span></div>
        </div>
        <div className="text-xs text-blue-300 mt-8 border-t border-blue-400/30 pt-4">
          SchoolLink v2.4.1 © 2024 SchoolLink Inc.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">SchoolLink</h1>
            <p className="text-gray-500 text-sm mt-1">School Management Platform</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Don't have an account? <a href="#" className="text-blue-600 hover:underline font-medium">Register</a>
            </p>
          </div>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="kavita.rao@schoollink.edu"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
              </label>
             <a href="#" className="text-sm text-blue-600 hover:underline">Forgot your password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;