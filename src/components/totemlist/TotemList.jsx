import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import TotemDetails from "../totem/TotemDetails";
import { Link } from "react-router-dom";

import "./TotemList.css";

const TotemList = ({ userId }) => {
  const [totems, setTotems] = useState([]);
  const [newTotem, setNewTotem] = useState({
    title: "",
    description: "",
    videoUrl: "",
  });
  const [editingTotem, setEditingTotem] = useState(null);
  const [selectedTotem, setSelectedTotem] = useState(null); // Para exibir detalhes do totem
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch de todos os totens do usuário selecionado
  useEffect(() => {
    const fetchTotems = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("Token não encontrado.");

        const response = await axios.get(`/totems?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTotems(response.data);
      } catch (error) {
        console.error("Erro ao buscar totens:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotems();
  }, [userId]);

  // Lógica para adicionar um novo totem
  const handleAddTotem = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      const response = await axios.post("/totems/totems", newTotem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems([...totems, response.data]);
      setNewTotem({ title: "", description: "", videoUrl: "" });
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao adicionar totem:", error);
      setErrorMessage(
        error.response?.data?.error || "Erro ao adicionar totem."
      );
    }
  };

  // Lógica para editar um totem
  const handleEditTotem = async (id) => {
    if (!editingTotem) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      const response = await axios.put(`/totems/${id}`, editingTotem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems((prev) =>
        prev.map((totem) => (totem._id === id ? response.data : totem))
      );
      setEditingTotem(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao editar totem:", error);
      setErrorMessage(error.response?.data?.error || "Erro ao editar totem.");
    }
  };

  // Lógica para deletar um totem
  const handleDeleteTotem = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      await axios.delete(`/totems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems((prev) => prev.filter((totem) => totem._id !== id));
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao deletar totem:", error);
      setErrorMessage(error.response?.data?.error || "Erro ao deletar totem.");
    }
  };

  const groupedTotems = totems.reduce((acc, totem) => {
    const userName = totem.userName || "Desconhecido";
    if (!acc[userName]) acc[userName] = [];
    acc[userName].push(totem);
    return acc;
  }, {});

  if (loading) {
    return <p>Carregando totens...</p>;
  }

  return (
    <div className="totemList">
      <h2>Lista de Totens</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div>
        <h3>Adicionar Novo Totem</h3>
        <input
          type="text"
          placeholder="Título"
          value={newTotem.title}
          onChange={(e) => setNewTotem({ ...newTotem, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newTotem.description}
          onChange={(e) =>
            setNewTotem({ ...newTotem, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="URL do Vídeo"
          value={newTotem.videoUrl}
          onChange={(e) =>
            setNewTotem({ ...newTotem, videoUrl: e.target.value })
          }
        />
        <button onClick={handleAddTotem}>Adicionar Totem</button>
      </div>

      {Object.keys(groupedTotems).map((userName) => (
        <div key={userName} className="user-group">
          <h3>{userName}</h3>
          <ul>
            {groupedTotems[userName].map((totem) => (
              <li key={totem._id}>
                <h4>{totem.title}</h4>
                <p>{totem.description}</p>
                <p>
                  <Link target="_blank" to={`/totem/${totem._id}`}>Ver Totem</Link>
                </p>
                <button onClick={() => setEditingTotem(totem)}>Editar</button>
                <button onClick={() => handleDeleteTotem(totem._id)}>
                  Deletar
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {editingTotem && (
        <div>
          <h3>Editar Totem</h3>
          <input
            type="text"
            value={editingTotem.title}
            onChange={(e) =>
              setEditingTotem({ ...editingTotem, title: e.target.value })
            }
          />
          <input
            type="text"
            value={editingTotem.description}
            onChange={(e) =>
              setEditingTotem({ ...editingTotem, description: e.target.value })
            }
          />
          <input
            type="url"
            value={editingTotem.videoUrl}
            onChange={(e) =>
              setEditingTotem({ ...editingTotem, videoUrl: e.target.value })
            }
          />
          <button onClick={() => handleEditTotem(editingTotem._id)}>
            Salvar Alterações
          </button>
          <button onClick={() => setEditingTotem(null)}>Cancelar</button>
        </div>
      )}

      {selectedTotem && (
        <TotemDetails
          totem={selectedTotem}
          onClose={() => setSelectedTotem(null)}
        />
      )}
    </div>
  );
};

export default TotemList;
