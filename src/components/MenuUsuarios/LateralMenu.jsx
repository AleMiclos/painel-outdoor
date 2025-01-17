import React, { useState, useEffect } from 'react';
import axios from '../../services/axios';
import TotemList from '../totemlist/TotemList';
import './LateralMenu.css';

const LateralMenu = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user === selectedUser ? null : user);
  };

  return (
    <div className="lateral-menu">
      <ul className="user-list">
        {Array.isArray(users) ? (
          users.map(user => (
            <li
              key={user.id}
              className={user === selectedUser ? 'selected' : ''}
              onClick={() => handleUserClick(user)}
            >
              {user.name}
            </li>
          ))
        ) : (
          <p>Sem usuários disponíveis.</p>
        )}
      </ul>

      {/* Renderizar TotemList para o usuário selecionado */}
      {selectedUser && (
        <div className="totem-list-container">
          <h3>Totens do Usuário: {selectedUser.name}</h3>
          <TotemList user={selectedUser} />
        </div>
      )}
    </div>
  );
};

export default LateralMenu;
