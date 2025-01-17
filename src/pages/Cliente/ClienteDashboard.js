import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Oval } from "react-loader-spinner";
import "./painel.css";
import Navbar from "../../components/menu/Navbar";

function TotemsDashboard() {
  const [totems, setTotems] = useState([]);
  const [editingTotem, setEditingTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchTotems = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token não encontrado.");

      // Chamar API para buscar totens do usuário logado
      const response = await axios.get("/totems", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotems(response.data); // Assumindo que a API retorna apenas os totens do usuário logado
    } catch (error) {
      setStatusMessage("Erro ao carregar os totens.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditing = (totem) => {
    setEditingTotem({ ...totem });
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
      setEditingTotem(null);
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
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Meus Totens</h1>

        {statusMessage && (
          <div
            className={`status-message ${
              statusMessage.includes("Erro") ? "error" : "success"
            }`}
            aria-live="polite"
          >
            {statusMessage}
          </div>
        )}

        {totems.length === 0 ? (
          <p className="no-totens-message">Nenhum totem encontrado.</p>
        ) : (
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
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default TotemsDashboard;
