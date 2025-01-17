import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para atualizar o estado do userName a partir do localStorage
  const updateUserName = () => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName("");
    }
  };

  // Atualiza o estado do userName ao montar o componente
  useEffect(() => {
    updateUserName();
    // Adiciona um evento para monitorar mudanças no localStorage
    window.addEventListener("storage", updateUserName);
    return () => {
      window.removeEventListener("storage", updateUserName);
    };
  }, []);

  // Função de login (redireciona para a tela de login)
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  // Função de logout (limpa o localStorage e redireciona para a home)
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    setUserName(""); // Limpa o estado de userName
    navigate("/"); // Redireciona para a página inicial (Home)
  };

  // Função para alternar o menu hamburguer
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <a href="/" className="logo">
        ALL DOOR
      </a>
      {/* Botão Hamburguer */}
      <div className="menu-toggle" onClick={toggleMenu}>
        <div />
        <div />
        <div />
      </div>
      <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
        <a href="/" onClick={(e) => e.preventDefault()}>
          Home
        </a>
        <a href="/about" onClick={(e) => e.preventDefault()}>
          About
        </a>
        <div className="user-controls">
          {userName ? (
            <>
              <span className="user-info">Bem-vindo, {userName}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button onClick={handleLoginRedirect} className="login-btn">
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
