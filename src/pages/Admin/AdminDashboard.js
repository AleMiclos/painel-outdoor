import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Oval } from "react-loader-spinner";
import "./adminPainel.css";
import Navbar from "../../components/menu/Navbar.jsx";

function AdminDashboard() {
  const [totems, setTotems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchTotems = async () => {
    try {
      const token = localStorage.getItem("userToken");

      // Corrigindo a URL da requisição
      const response = await axios.get("/totems", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems(response.data || []);
      setStatusMessage("Totens carregados com sucesso!");
    } catch (error) {
      console.error("Erro ao carregar os totens:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Ocorreu um erro ao carregar os totens. Tente novamente.";
      setStatusMessage(errorMsg);
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
      const errorMsg =
        error.response?.data?.message ||
        "Erro ao remover o totem. Por favor, tente novamente.";
      setStatusMessage(errorMsg);
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
      <div>
        <Navbar />
      </div>
      <h1>Dashboard do Administrador</h1>
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
        <p className="no-totems-message">Nenhum totem registrado até o momento.</p>
      ) : (
        <div className="totems-cards">
          {totems.map((totem) => (
            <div key={totem._id} className="totem-card">
              <h2>{totem.title}</h2>
              <p>{totem.description}</p>
              <div className="card-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(totem._id)}
                  aria-label={`Excluir totem ${totem.title}`}
                >
                  Excluir
                </button>
                <a
                  href={`/totem/${totem._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver detalhes do totem ${totem.title}`}
                >
                  Ver
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
