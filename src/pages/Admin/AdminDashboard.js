import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Oval } from "react-loader-spinner";
import "./adminPainel.css";
import Navbar from "../../components/menu/Navbar.jsx";

const StatusMessage = ({ message }) => {
  if (!message) return null;
  const isError = message.includes("Erro");
  return (
    <div
      className={`status-message ${isError ? "error" : "success"}`}
      aria-live="polite"
    >
      {message}
    </div>
  );
};

const TotemCard = ({
  totem,
  isEditing,
  onEdit,
  onDelete,
  onCancelEdit,
  onUpdateField,
  onSaveChanges,
}) => {
  if (isEditing) {
    return (
      <div className="totem-card">
        <input
          type="text"
          value={totem.title}
          onChange={(e) => onUpdateField("title", e.target.value)}
          placeholder="Título do Totem"
        />
        <textarea
          value={totem.description}
          onChange={(e) => onUpdateField("description", e.target.value)}
          placeholder="Descrição do Totem"
        />
        <input
          type="text"
          value={totem.videoUrl}
          onChange={(e) => onUpdateField("videoUrl", e.target.value)}
          placeholder="URL do Vídeo"
        />
        <button className="btn success" onClick={onSaveChanges}>
          Atualizar
        </button>
        <button className="btn secondary" onClick={onCancelEdit}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="totem-card">
      <h2>{totem.title}</h2>
      <p>{totem.description}</p>
      <p>
        <a
          href={totem.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link para o Totem
        </a>
      </p>
      <div className="card-actions">
        <button className="edit-button" onClick={() => onEdit(totem)}>
          Editar
        </button>
        <button className="delete-button" onClick={() => onDelete(totem._id)}>
          Excluir
        </button>
      </div>
    </div>
  );
};

function AdminDashboard() {
  const [totems, setTotems] = useState([]);
  const [editingTotem, setEditingTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchTotems = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const response = await axios.get("/totems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotems(response.data);
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
      if (!token) {
        setStatusMessage("Token inválido. Faça login novamente.");
        return;
      }
      await axios.delete(`/totems/${totemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatusMessage("Totem removido com sucesso!");
      fetchTotems();
    } catch (error) {
      console.error("Erro ao remover o totem:", error);
      setStatusMessage("Erro ao remover o totem. Por favor, tente novamente.");
    }
  };

  const handleStartEditing = (totem) => setEditingTotem({ ...totem });

  const handleUpdateField = (field, value) =>
    setEditingTotem((prev) => ({ ...prev, [field]: value }));

  const handleSaveChanges = async () => {
    if (!editingTotem) return;

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
      setStatusMessage("Erro ao atualizar o totem. Por favor, tente novamente.");
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
    <div className="admin-dashboard">
      <Navbar />
      <h1>Dashboard do Administrador</h1>
      <StatusMessage message={statusMessage} />
      {totems.length === 0 ? (
        <p className="no-totems-message">Nenhum totem registrado até o momento.</p>
      ) : (
        <div className="totems-cards">
          {totems.map((totem) => (
            <TotemCard
              key={totem._id}
              totem={editingTotem?._id === totem._id ? editingTotem : totem}
              isEditing={editingTotem?._id === totem._id}
              onEdit={handleStartEditing}
              onDelete={handleDelete}
              onCancelEdit={() => setEditingTotem(null)}
              onUpdateField={handleUpdateField}
              onSaveChanges={handleSaveChanges}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
