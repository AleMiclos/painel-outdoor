import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/axios"
import "./TotemDetails.css";

const TotemDetails = () => {
  const { totemId } = useParams();
  const [totem, setTotem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para buscar os detalhes do totem
  const fetchTotemDetails = async () => {
    try {
      const { data } = await api.get(`/totems/${totemId}`);
      setTotem(data);
    } catch (err) {
      setError("Erro ao carregar os detalhes do totem.");
    } finally {
      setLoading(false);
    }
  };

  // Chama a função de busca assim que o componente for carregado e define o intervalo de atualização automática
  useEffect(() => {
    setLoading(true);
    fetchTotemDetails(); // Carrega os dados imediatamente ao montar o componente

    // Define o intervalo para atualização a cada 30 segundos (exemplo)
    const intervalId = setInterval(() => {
      fetchTotemDetails();
    }, 30000);  // 30.000 ms = 30 segundos

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [totemId]); // Atualiza os dados sempre que o totemId mudar

  // Função para extrair o ID do vídeo do Vimeo da URL
  const extractVimeoVideoId = (url) => {
    const match = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (match) {
      return match[1];
    } else {
      console.error("Erro ao extrair o ID do vídeo do Vimeo:", url);
      return null;
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="main-container">
   {totem ? (
  <>
    <div className="video-container">
      {totem.videoUrl && (
        <iframe
          src={`https://player.vimeo.com/video/${extractVimeoVideoId(totem.videoUrl)}?autoplay=1&muted=1&loop=1`}
          width="640"
          height="360"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vídeo do Totem"
        ></iframe>
      )}
    </div>
    <div className="content">
      <h2>{totem.title}</h2>
      <p>{totem.description}</p>
    </div>
  </>
) : (
  <p>Totem não encontrado.</p>
)}

    </div>
  );
};

export default TotemDetails;
