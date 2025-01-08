import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Oval } from "react-loader-spinner";
import "./painel.css";
import Navbar from '../../components/menu/Navbar';



function ClienteDashboard() {
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    isActive: true,
  });

  const fetchTotemData = async () => {
    try {
      const totemId = localStorage.getItem("totemId") || new URLSearchParams(window.location.search).get("totemId");

      if (!totemId || totemId === "undefined") {
        setStatusMessage("Totem não encontrado.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("userToken");

      if (!token) {
        setStatusMessage("Token não encontrado.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`/totems/${totemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { title, description, videoUrl, isActive } = response.data;

      setFormData({
        title: title || "",
        description: description || "",
        videoUrl: videoUrl || "",
        isActive: isActive !== undefined ? isActive : false,
      });

      setStatusMessage("Informações carregadas com sucesso!");
    } catch (error) {
      handleError(error, "Erro ao carregar informações.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totemId = localStorage.getItem("totemId") || new URLSearchParams(window.location.search).get("totemId");
      const token = localStorage.getItem("userToken");

      if (!totemId || totemId === "undefined") {
        throw new Error("Totem não identificado.");
      }

      if (!token) {
        throw new Error("Token de autenticação ausente.");
      }

      await axios.post(`/totems/${totemId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStatusMessage("Informações atualizadas com sucesso!");
      fetchTotemData();
    } catch (error) {
      handleError(error, "Erro ao atualizar informações do totem.");
    }
  };

  const handleError = (error, defaultMessage) => {
    const message = error.response?.data?.error || defaultMessage;
    if (error.response?.status === 401) {
      setStatusMessage("Token inválido. Redirecionando para login...");
      setTimeout(() => {
        window.location.href = "/login";  // ou use react-router
      }, 2000);
    } else {
      setStatusMessage(message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const extractVimeoVideoId = (url) => {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (match) {
      console.log("Vimeo Video ID:", match[1]);
      return match[1];
    } else {
      console.error("Failed to extract Vimeo video ID from URL:", url);
      return null;
    }
  };

  useEffect(() => {
    const totemId = localStorage.getItem("totemId") || new URLSearchParams(window.location.search).get("totemId");
    if (totemId && totemId !== "undefined") {
      fetchTotemData();
    } else {
      setStatusMessage("Totem não encontrado.");
      setLoading(false);
    }
  }, []);

  


  if (loading) {
    return (
      <div className="loading-container">
        <Oval color="#00BFFF" height={80} width={80} />
        <p>Carregando dados do totem...</p>
      </div>
    );
  }

  return (
    <><div className="dashboard-container">
      <div>
      <Navbar />
    </div>
        <h1 className="dashboard-title">Painel do Totem</h1>
        <p className="dashboard-subtitle">Atualize as informações exibidas no totem digital.</p>
        <p className="dashboard-subtitle">
          {formData && (
            <a
              href={`http://localhost:3000/totem/${localStorage.getItem("totemId") || new URLSearchParams(window.location.search).get("totemId")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Seu totem: {localStorage.getItem("totemId") || new URLSearchParams(window.location.search).get("totemId")}
            </a>
          )}
        </p>

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes("Erro") ? "error" : "success"}`} aria-live="polite">
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Digite o título"
              required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Digite a descrição"
              required />
          </div>

          <div className="form-group">
            <label htmlFor="videoUrl">URL do Vídeo (Vimeo)</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="Cole a URL do vídeo do Vimeo"
              required />
          </div>



          <div className="form-actions">
            <button type="submit" className="btn primary">Atualizar</button>
            <button type="button" className="btn secondary" onClick={fetchTotemData}>Recarregar</button>
          </div>
        </form>

        {formData.videoUrl && (
          <div className="video-preview">
            <h2>Pré-visualização do Vídeo</h2>
            <iframe
              src={`https://player.vimeo.com/video/${extractVimeoVideoId(formData.videoUrl)}`}
              width="640"
              height="360"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Vídeo do Totem"
            ></iframe>
          </div>
        )}
      </div></>
  );
}

export default ClienteDashboard;
