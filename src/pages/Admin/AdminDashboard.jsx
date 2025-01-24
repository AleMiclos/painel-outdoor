import React, { useState, useEffect } from "react";
import axios from "../../services/axios.js";
import { Oval } from "react-loader-spinner";
import "./adminPainel.css";
import Navbar from "../../components/menu/Navbar.jsx";
import LateralMenu from "../../components/MenuUsuarios/LateralMenu.jsx";
import TotemList from "../../components/totemlist/TotemList.jsx";

const StatusMessage = ({ message }) => {
  if (!message) return null;
  const isError = message.toLowerCase().includes("erro");
  return (
    <div
      className={`status-message ${isError ? "error" : "success"}`}
      aria-live="polite"
    >
      {message}
    </div>
  );
};

function AdminDashboard() {
  const [totems, setTotems] = useState([]);
  const [editingTotem, setEditingTotem] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchTotems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const response = await axios.get("/totems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotems(response.data);
      setStatusMessage("");
    } catch (error) {
      console.error("Erro ao carregar os totens:", error);
      setStatusMessage("Erro ao carregar os totens.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (totemId) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido. Faça login novamente.");

      await axios.delete(`/totems/${totemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusMessage("Totem removido com sucesso!");
      fetchTotems(); // Recarrega a lista de totens
    } catch (error) {
      console.error("Erro ao remover o totem:", error);
      setStatusMessage("Erro ao remover o totem. Por favor, tente novamente.");
    }
  };

  const handleSaveChanges = async () => {
    if (!editingTotem) {
      setStatusMessage("Nenhum totem em edição.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido. Faça login novamente.");

      const response = await axios.put(
        `/totems/${editingTotem._id}`,
        editingTotem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTotems((prev) =>
        prev.map((totem) =>
          totem._id === editingTotem._id ? response.data : totem
        )
      );
      setStatusMessage("Totem atualizado com sucesso!");
      setEditingTotem(null);
    } catch (error) {
      console.error("Erro ao atualizar o totem:", error);
      setStatusMessage(
        "Erro ao atualizar o totem. Por favor, tente novamente."
      );
    }
  };

  useEffect(() => {
    fetchTotems();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Oval color="#00BFFF" height={80} width={80} />
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <><Navbar /><div className="admin-dashboard">
      <StatusMessage message={statusMessage} />
      <div className="layout-container">
        <LateralMenu
          onSelectUser={setSelectedUserId}
          selectedUser={selectedUserId} />
        <div className="main-content">
          {selectedUserId ? (
            <TotemList
              userId={selectedUserId}
              totems={totems.filter((totem) => totem.userId === selectedUserId)}
              onEdit={(totem) => setEditingTotem(totem)}
              onDelete={handleDelete}
              isEditing={!!editingTotem}
              editingTotem={editingTotem}
              onUpdateField={(field, value) => setEditingTotem((prev) => ({ ...prev, [field]: value }))}
              onSaveChanges={handleSaveChanges} />
          ) : (
            <p className="no-user-selected"></p>
          )}
        </div>
      </div>
    </div></>
  );
}

export default AdminDashboard;
