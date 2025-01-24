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
    address: "",
    isOnline: false,
  });
  const [editingTotem, setEditingTotem] = useState(null);
  const [selectedTotem, setSelectedTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage("Erro ao buscar totens. Tente novamente mais tarde.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotems();
  }, [userId]);

  const handleAddTotem = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      const response = await axios.post("/totems/totems", newTotem, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTotems([...totems, response.data]);
      setNewTotem({
        title: "",
        description: "",
        videoUrl: "",
        address: "",
        isOnline: false,
      });
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao adicionar totem. Verifique os campos.");
    }
  };

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
      console.error(error);
      setErrorMessage("Erro ao editar totem.");
    }
  };

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
      console.error(error);
      setErrorMessage("Erro ao deletar totem.");
    }
  };

  if (loading) return <p>Carregando totens...</p>;

  return (
    <div className="totemList">
      <h2>Totens</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="form">
        <h3>Novo Totem</h3>
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
          type="url"
          placeholder="URL do Vídeo"
          value={newTotem.videoUrl}
          onChange={(e) =>
            setNewTotem({ ...newTotem, videoUrl: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Endereço"
          value={newTotem.address}
          onChange={(e) =>
            setNewTotem({ ...newTotem, address: e.target.value })
          }
        />
        <label>
          <input
            type="checkbox"
            checked={newTotem.isOnline}
            onChange={(e) =>
              setNewTotem({ ...newTotem, isOnline: e.target.checked })
            }
          />
          Online
        </label>
        <button onClick={handleAddTotem}>Adicionar</button>
      </div>

      <div className="totem-list">
        {totems.map((totem) => (
          <div key={totem._id} className="totem-card">
            <h4>{totem.title}</h4>
            <p>{totem.description}</p>
            <p>Endereço: {totem.address}</p>
            <p>
              Status:{" "}
              <span style={{ color: totem.isOnline ? "green" : "red" }}>
                {totem.isOnline ? "Online" : "Offline"}
              </span>
            </p>
            <p>
              {" "}
              <Link target="_blank" to={`/totem/${totem._id}`}>
                Ver Totem
              </Link>{" "}
            </p>
            <button onClick={() => setEditingTotem(totem)}>Editar</button>
            <button onClick={() => handleDeleteTotem(totem._id)}>
              Deletar
            </button>
          </div>
        ))}
      </div>

      {editingTotem && (
        <div className="edit-form">
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
          <input
            type="text"
            value={editingTotem.address}
            onChange={(e) =>
              setEditingTotem({ ...editingTotem, address: e.target.value })
            }
          />
          <label>
            <input
              type="checkbox"
              checked={editingTotem.isOnline}
              onChange={(e) =>
                setEditingTotem({ ...editingTotem, isOnline: e.target.checked })
              }
            />
            Online
          </label>
          <button onClick={() => handleEditTotem(editingTotem._id)}>
            Salvar
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
