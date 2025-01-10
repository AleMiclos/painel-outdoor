import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName") || "Usuário";
    setUserName(storedUserName);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault(); 
    localStorage.clear(); 
    navigate("/login");
  };

  return (
    <header className="header">
      <a href="/" className="logo">Logo</a>

      <nav className="navbar">
        <a href="/" onClick={() => navigate("/")}>Home</a>
        <a href="/" onClick={() => navigate("/about")}>About</a>
        <span className="user-info">Bem-vindo, {userName}</span>
        <a href="/" onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  );
};

export default Navbar;
