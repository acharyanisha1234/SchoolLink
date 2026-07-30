import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
              SL
            </div>

            <span className="text-2xl font-bold">
              SchoolLink
            </span>
          </div>

          <div className="mt-16">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to SchoolLink
            </h1>

            <p className="text-blue-100 text-lg mb-6">
              The Complete School Management Platform
            </p>

            <p className="text-blue-200 text-sm max-w-md">
              Unifying administration, teaching, and learning in one
              powerful, beautifully designed platform.
            </p>
          </div>
        </div>

        <div className="flex gap-8 text-sm">
          <div>
            <span className="block text-2xl font-bold">
              1,200+
            </span>
            <span className="text-blue-200">Students</span>
          </div>

          <div>
            <span className="block text-2xl font-bold">
              80+
            </span>
            <span className="text-blue-200">Teachers</span>
          </div>

          <div>
            <span className="block text-2xl font-bold">
              95%
            </span>
            <span className="text-blue-200">Satisfaction</span>
          </div>
        </div>

        <div className="text-xs text-blue-300 mt-8 border-t border-blue-400/30 pt-4">
          SchoolLink v2.4.1 © 2024 SchoolLink Inc.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Login Form */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;