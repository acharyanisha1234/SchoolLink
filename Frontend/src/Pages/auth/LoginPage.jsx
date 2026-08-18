import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({ password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        const role = user.role?.toUpperCase() || "";
        if (role === "ADMIN") navigate("/admin", { replace: true });
        else if (role === "TEACHER") navigate("/teacher", { replace: true });
        else if (role === "STUDENT") navigate("/student", { replace: true });
      } catch (e) {
        console.error("Auto-redirect error", e);
      }
    }
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (loginData.password.length < 6) {
      setLoginErrors({ password: "Password must be at least 6 characters." });
      return;
    }
    setLoginErrors({ password: "" });

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.accessToken && data.user) {
        let role = data.user.role ? data.user.role.toUpperCase() : "STUDENT";
        if (role === "USER") role = "STUDENT";

        const normalizedUser = { ...data.user, role };

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(normalizedUser));

        showToast("Login Successful", "success");
        setLoading(false);

        if (role === "ADMIN") navigate("/admin", { replace: true });
        else if (role === "TEACHER") navigate("/teacher", { replace: true });
        else navigate("/student", { replace: true });
      } else {
        showToast(data.message || "Login failed.", "error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      let serverMessage = "Login failed. Please try again.";

      if (error.message.includes("Network Error")) {
        serverMessage = "Cannot connect to server. Is your backend running?";
      }

      showToast(serverMessage, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      {toast.message && (
        <div
          className={`fixed top-6 right-6 p-4 rounded-xl shadow-2xl text-white z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT SIDE – Branding Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">
                SL
              </div>
              <span className="text-2xl font-bold tracking-tight">SchoolLink</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                Welcome to <br />SchoolLink
              </h1>
              <p className="text-blue-100 text-lg font-light">
                The Complete School Management Platform
              </p>
              <p className="text-blue-200 text-sm max-w-sm leading-relaxed">
                Unifying administration, teaching, and learning in one powerful,
                beautifully designed platform.
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-sm mt-10">
            <div>
              <span className="block text-3xl font-bold">1,200+</span>
              <span className="text-blue-200">Students</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">80+</span>
              <span className="text-blue-200">Teachers</span>
            </div>
            <div>
              <span className="block text-3xl font-bold">95%</span>
              <span className="text-blue-200">Satisfaction</span>
            </div>
          </div>

          <div className="text-xs text-blue-300 mt-8 border-t border-blue-400/30 pt-4">
            SchoolLink v2.4.1 © 2024 SchoolLink Inc.
          </div>
        </div>

        {/* RIGHT SIDE – Login Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-14 flex flex-col justify-center">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">SchoolLink</h1>
            <p className="text-gray-500 text-sm">School Management Platform</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
              Sign in to your account
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <Link
                to="/reset-password"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* 
            - Removed "OR" divider and Google button as requested.
          */}

          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-medium">For Students & Schools:</span> Login using the email
              and password provided by your school. Please contact your school admin if you
              haven't received the credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;