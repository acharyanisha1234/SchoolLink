import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Step 1: Send OTP 
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || "OTP sent to your email.", "success");
        setIsOtpSent(true);
        setLoading(false);
      } else {
        showToast(data.message || "Failed to send OTP.", "error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      let msg = "Failed to send OTP. Please try again.";
      if (error.message.includes("Network Error")) msg = "Cannot connect to server. Is your backend running?";
      showToast(msg, "error");
      setLoading(false);
    }
  };

  // ---------- Step 2: Reset Password ----------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      showToast("Please enter all 6 digits of the OTP.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || "Password reset successful! Please log in.", "success");
        setLoading(false);
        setTimeout(() => navigate("/"), 2000);
      } else {
        showToast(data.message || "Failed to reset password.", "error");
        setLoading(false);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      let msg = "Failed to reset password. Please try again.";
      if (error.message.includes("Network Error")) msg = "Cannot connect to server. Is your backend running?";
      showToast(msg, "error");
      setLoading(false);
    }
  };

  // OTP input handler (auto‑focus next field)
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value;
    setOtpDigits(updated);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const renderOtpInputs = () => (
    <div className="flex justify-center gap-3">
      {[...Array(6)].map((_, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          maxLength="1"
          type="text"
          value={otpDigits[index]}
          onChange={(e) => handleOtpChange(e.target.value, index)}
          className="w-12 h-12 text-center rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        />
      ))}
    </div>
  );

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
        {/* LEFT SIDE - Brand/Info Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-700 to-indigo-800 text-white p-10 lg:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg">SL</div>
              <span className="text-2xl font-bold tracking-tight">SchoolLink</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">Reset <br />Password</h1>
              <p className="text-blue-100 text-lg font-light">The Complete School Management Platform</p>
              <p className="text-blue-200 text-sm max-w-sm leading-relaxed">
                Unifying administration, teaching, and learning in one powerful, beautifully designed platform.
              </p>
            </div>
          </div>
          <div className="flex gap-8 text-sm mt-10">
            <div><span className="block text-3xl font-bold">1,200+</span><span className="text-blue-200">Students</span></div>
            <div><span className="block text-3xl font-bold">80+</span><span className="text-blue-200">Teachers</span></div>
            <div><span className="block text-3xl font-bold">95%</span><span className="text-blue-200">Satisfaction</span></div>
          </div>
          <div className="text-xs text-blue-300 mt-8 border-t border-blue-400/30 pt-4">
            SchoolLink v2.4.1 © 2024 SchoolLink Inc.
          </div>
        </div>

        {/* RIGHT SIDE - Reset Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-14 flex flex-col justify-center">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">SchoolLink</h1>
            <p className="text-gray-500 text-sm">School Management Platform</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Reset Password</h2>
            <p className="text-gray-500 text-sm mt-1">
              Remember your password? <Link to="/" className="text-blue-600 hover:underline font-medium">Login</Link>
            </p>
          </div>

          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Enter the 6-digit verification code
                </label>
                {renderOtpInputs()}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpSent(false);
                  setOtpDigits(["", "", "", "", "", ""]);
                }}
                className="text-sm text-blue-600 hover:underline font-medium block mx-auto"
              >
                ← Go back to enter email again
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;