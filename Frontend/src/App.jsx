import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AdminDashboard from "./Pages/AdminDashboard";
import ResetPasswordPage from "./Pages/auth/ResetPasswordPage";
import TeacherDashboard from "./Pages/TeacherDashboard";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentSidebar from "./components/StudentSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES*/}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/*PROTECTED ROUTES  */}
      
      {/* Admin Dashboard - Only accessible by users with ADMIN role */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Teacher Dashboard - Only accessible by users with TEACHER role */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student Dashboard - Only accessible by users with STUDENT role */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* CATCH-ALL ROUTE*/}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;