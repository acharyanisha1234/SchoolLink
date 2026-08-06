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
  const [errors, setErrors] = useState({});

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
      const response = await fetch("http://localhost:5000/api/auth/send-reset-otp", {
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
      if (error.message.includes("Network Error")) {
        msg = "Cannot connect to server. Is your backend running?";
      }
      showToast(msg, "error");
      setLoading(false);
    }
  };

  // Placeholder for Step 2 – to be implemented later
  const handleResetPassword = (e) => { e.preventDefault(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      {/* Toast Notification */}
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
        {/* LEFT SIDE - same as before */}
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

        {/* RIGHT SIDE */}
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
            // Step 2 will be added in next commit
            <div>Step 2 – coming soon</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;