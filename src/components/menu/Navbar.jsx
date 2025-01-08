import React from "react";
import { useNavigate } from "react-router-dom"; // Para redirecionamento
import './NavBar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do link
        localStorage.clear(); // Limpa tudo
        navigate("/login");
    };

    return (
        <header className="header">
            <a href="/" className="logo">Logo</a>

            <nav className="navbar">
                <a href="/" onClick={() => navigate("/")}>Home</a>
                <a href="/" onClick={() => navigate("/about")}>About</a>
                <a href="/" onClick={handleLogout}>Logout</a>
            </nav>
        </header>
    );
}

export default Navbar;
