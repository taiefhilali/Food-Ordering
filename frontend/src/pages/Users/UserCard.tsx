import React from 'react';

import { User } from '@/types';

// Define the props type
interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{user.username}</h5>
        <p className="card-text">{user.email}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default UserCard;
