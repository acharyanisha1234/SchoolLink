import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT SIDE - Brand/Info Panel */}
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
                Join <br />SchoolLink
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
            <div><span className="block text-3xl font-bold">1,200+</span><span className="text-blue-200">Students</span></div>
            <div><span className="block text-3xl font-bold">80+</span><span className="text-blue-200">Teachers</span></div>
            <div><span className="block text-3xl font-bold">95%</span><span className="text-blue-200">Satisfaction</span></div>
          </div>
          <div className="text-xs text-blue-300 mt-8 border-t border-blue-400/30 pt-4">
            SchoolLink v2.4.1 © 2024 SchoolLink Inc.
          </div>
        </div>

        {/* RIGHT SIDE - Register Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-14 flex flex-col justify-center">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">SchoolLink</h1>
            <p className="text-gray-500 text-sm">School Management Platform</p>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Create an account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Login
              </Link>
            </p>
          </div>
          {/* Form will be added next */}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;