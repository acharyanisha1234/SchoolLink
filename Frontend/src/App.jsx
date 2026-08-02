import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage"; 


function App() {
  return (
    <Routes>
      {/* Login page (SchoolLink design, no demo credentials) */}
      <Route path="/" element={<LoginPage />} />
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;