import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleRequired }) {
  const token = localStorage.getItem("userToken"); // Token do usuário
  const userRole = localStorage.getItem("userRole"); // Papel do usuário (admin ou cliente)

  // Verifica se o usuário está autenticado
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Verifica se o usuário tem o papel necessário para acessar a rota
  if (roleRequired && userRole !== roleRequired) {
    // Redireciona o usuário cliente para o dashboard do cliente
    if (userRole === "cliente") {
      return <Navigate to="/cliente-dashboard" />;
    }
    // Redireciona o usuário admin para o dashboard do admin
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" />;
    }
  }

  return children;
}

export default ProtectedRoute;
