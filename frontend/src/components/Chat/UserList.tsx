// components/UserList/UserList.tsx
import React from 'react';
import './userList.css';

interface User {
  _id: string;
  username: string;
  imageUrl: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user._id} className="user-item">
          <img src={user.imageUrl} alt={user.username} className="user-avatar" />
          <span className="user-name">{user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default UserList;
