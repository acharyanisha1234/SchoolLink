import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  // Step 1: Email
  const [email, setEmail] = useState("");
  // Step 2: OTP and new password
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  // Empty render for now – will add layout in later commits
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left panel placeholder */}
        <div className="lg:w-1/2">Left Panel</div>
        {/* Right panel placeholder */}
        <div className="lg:w-1/2">Right Panel</div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;