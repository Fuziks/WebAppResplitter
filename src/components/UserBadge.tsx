import '../styles.css';
import { UserBadgeProps } from '../types/types';

export const UserBadge = ({ username, onRemove }: UserBadgeProps) => {
  return (
    <div className="user-tag">
      <span>{username}</span>
      <button onClick={onRemove}>×</button>
    </div>
  );
};
