import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Oval } from "react-loader-spinner";
import "./painel.css";
import Navbar from "../../components/menu/Navbar";

function ClienteDashboard() {
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
      setStatusMessage("Erro ao carregar os totens.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTotem = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const newTotem = {
        title: "Novo Totem",
        description: "Descrição do totem",
        videoUrl: "https://example.com/video.mp4", // URL exemplo
        isActive: true,
      };

      const response = await axios.post("/totems", newTotem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems((prev) => [...prev, response.data.totem]);
      setStatusMessage("Totem adicionado com sucesso!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro ao adicionar o totem.";
      setStatusMessage(errorMessage);
    }
  };

  const handleRemoveTotem = async (totemId) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      await axios.delete(`/totems/${totemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems((prev) => prev.filter((totem) => totem._id !== totemId));
      setStatusMessage("Totem removido com sucesso!");
    } catch (error) {
      setStatusMessage("Erro ao remover o totem.");
    }
  };

  const handleStartEditing = (totem) => {
    setEditingTotem({ ...totem }); // Copia o totem para edição
  };

  const handleUpdateField = (field, value) => {
    setEditingTotem((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!editingTotem) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      const response = await axios.put(`/totems/${editingTotem._id}`, editingTotem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems((prev) =>
        prev.map((totem) =>
          totem._id === editingTotem._id ? response.data : totem
        )
      );
      setStatusMessage("Totem atualizado com sucesso!");
      setEditingTotem(null); // Sai do modo de edição
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Erro ao atualizar o totem.";
      setStatusMessage(errorMessage);
    }
  };

  useEffect(() => {
    fetchTotems();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Oval color="#00BFFF" height={80} width={80} />
        <p>Carregando dados dos totens...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <h1 className="dashboard-title">Painel de Totens</h1>
      <button className="btn primary" onClick={handleAddTotem}>
        Adicionar Totem
      </button>

      {statusMessage && (
        <div
          className={`status-message ${statusMessage.includes("Erro") ? "error" : "success"}`}
          aria-live="polite"
        >
          {statusMessage}
        </div>
      )}

      <div className="totens-list">
        {totems.map((totem) => (
          <div key={totem._id} className="totem-card">
            {editingTotem && editingTotem._id === totem._id ? (
              <>
                <input
                  type="text"
                  value={editingTotem.title}
                  onChange={(e) => handleUpdateField("title", e.target.value)}
                  placeholder="Título do Totem"
                />
                <textarea
                  value={editingTotem.description}
                  onChange={(e) => handleUpdateField("description", e.target.value)}
                  placeholder="Descrição do Totem"
                />
                <input
                  type="text"
                  value={editingTotem.videoUrl}
                  onChange={(e) => handleUpdateField("videoUrl", e.target.value)}
                  placeholder="URL do Vídeo"
                />
                <button className="btn success" onClick={handleSaveChanges}>
                  Atualizar
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setEditingTotem(null)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <h3>{totem.title}</h3>
                <p>{totem.description}</p>
                <p>{totem.videoUrl}</p>
                <button
                  className="btn primary"
                  onClick={() => handleStartEditing(totem)}
                >
                  Editar
                </button>
                <button
                  className="btn secondary"
                  onClick={() => handleRemoveTotem(totem._id)}
                >
                  Remover
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClienteDashboard;
