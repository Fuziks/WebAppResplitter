import { useState } from 'react';
import { UserBadge } from './UserBadge';
import '../styles.css';
import { UserSelectorProps } from '../types/types';



export const UserSelector = ({ onAddUser, users, onRemoveUser }: UserSelectorProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddUser = () => {
    if (inputValue.trim() && !users.includes(inputValue.trim())) {
      onAddUser(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div>
      <div className="user-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Имя пользователя"
          onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
        />
        <button onClick={handleAddUser}>
          Добавить
        </button>
      </div>
      
      <div className="user-tags">
        {users.map(user => (
          <UserBadge 
            key={user} 
            username={user} 
            onRemove={() => onRemoveUser(user)}
          />
        ))}
      </div>
    </div>
  );
};