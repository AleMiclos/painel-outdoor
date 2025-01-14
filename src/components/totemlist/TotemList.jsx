import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import "./TotemList.css";

const TotemList = () => {
  const [totems, setTotems] = useState([]);
  const [newTotem, setNewTotem] = useState({ title: "", description: "", link: "" });
  const [editingTotem, setEditingTotem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch de todos os totens
  useEffect(() => {
    const fetchTotems = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) throw new Error("Token não encontrado.");

        const response = await axios.get("/totems", {
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
  }, []);

  // Lógica para adicionar um novo totem
  const handleAddTotem = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      const response = await axios.post(
        "/totems",
        newTotem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTotems([...totems, response.data]);
      setNewTotem({ title: "", description: "", link: "" });
    } catch (error) {
      console.error("Erro ao adicionar totem:", error);
    }
  };

  // Lógica para editar um totem
  const handleEditTotem = async (id) => {
    if (!editingTotem) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("Token inválido.");

      const response = await axios.put(
        `/totems/${id}`,
        editingTotem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTotems((prev) =>
        prev.map((totem) => (totem._id === id ? response.data : totem))
      );
      setEditingTotem(null);
    } catch (error) {
      console.error("Erro ao editar totem:", error);
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
    } catch (error) {
      console.error("Erro ao deletar totem:", error);
    }
  };

  // Agrupando totens por usuário
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

      {/* Formulário para adicionar novo totem */}
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
          type="url"
          placeholder="Link do Vídeo"
          value={newTotem.link}
          onChange={(e) => setNewTotem({ ...newTotem, link: e.target.value })}
        />
        <button onClick={handleAddTotem}>Adicionar Totem</button>
      </div>

      {/* Lista de Totens agrupados por usuário */}
      {Object.keys(groupedTotems).map((userName) => (
        <div key={userName} className="user-group">
          <h3>{userName}</h3>
          <ul>
            {groupedTotems[userName].map((totem) => (
              <li key={totem._id}>
                <h4>{totem.title}</h4>
                <p>{totem.description}</p>
                <p>
                  <a
                    href={totem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Totem
                  </a>
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

      {/* Formulário para editar um totem */}
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
            value={editingTotem.link}
            onChange={(e) =>
              setEditingTotem({ ...editingTotem, link: e.target.value })
            }
          />
          <button onClick={() => handleEditTotem(editingTotem._id)}>
            Salvar Alterações
          </button>
          <button onClick={() => setEditingTotem(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default TotemList;
