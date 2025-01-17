import React, { useState } from 'react';
import axios from '../../services/axios';
import { jwtDecode } from 'jwt-decode'; // Remover as chaves {} da importação
import { useNavigate } from 'react-router-dom';
import './login.css';

function LoginPage() {
  const [token, setToken] = useState('');
  const [name, setName] = useState(''); // Novo estado para o nome
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('cliente');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const response = await axios.post('/auth/login', { email, password });
      const tokenFromApi = response.data.token;
      const decoded = jwtDecode(tokenFromApi);

      localStorage.setItem('userName', decoded.name); // Armazena o nome decodificado do token
      localStorage.setItem('userToken', tokenFromApi);
      setToken(tokenFromApi);

      const { role, totemId } = decoded;

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(`/cliente-dashboard?totemId=${totemId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const handleRegister = async () => {
    setError('');
    try {
      await axios.post('/auth/register', { name, email, password, role }); // Enviando o nome
      alert('Usuário registrado com sucesso!');
      setIsRegistering(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar usuário. Tente novamente.');
    }
  };

  return (
    <div className="container">
      <form className="loginForm" onSubmit={(e) => e.preventDefault()}>
        <h2 className="logint">{isRegistering ? 'Registrar' : 'Login'}</h2>

        {error && <p className="error-message">{error}</p>}

        {isRegistering && ( // Exibir campo de nome apenas no registro
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>

        {isRegistering && (
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="cliente">Cliente</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}

        <div className="form-button">
          <button type="button" onClick={isRegistering ? handleRegister : handleLogin}>
            {isRegistering ? 'Registrar' : 'Login'}
          </button>
        </div>

        <div className="switch-auth">
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Já tem conta? Faça login' : 'Ainda não tem conta? Registre-se'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
