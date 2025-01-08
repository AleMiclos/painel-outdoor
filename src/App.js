import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ClienteDashboard from "./pages/Cliente/ClienteDashboard";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TotemDetails from "./components/totem/TotemDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Painel do Cliente */}
        <Route
          path="/cliente-dashboard"
          element={
            <ProtectedRoute>
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />

        {/* Painel do Administrador */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Detalhes de um Totem */}
        <Route
          path="/totem/:totemId"
          element={
            <ProtectedRoute>
              <TotemDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
