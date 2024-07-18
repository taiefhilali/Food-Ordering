import React, { useEffect, useState } from 'react';
import './userList.css';
import axios from 'axios';
import { ChatItem } from 'react-chat-elements'; // Import ChatItem component

interface User {
  _id: string;
  username: string;
  imageUrl: string;
  onSelectUser: (user: User) => void; // New prop to handle user selection
}

const UserList: React.FC<{ onSelectUser: (user: User) => void }> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/messages/fetch-senders');
        
        // Use a Map to filter out duplicate users
        const uniqueUsersMap = new Map<string, User>();
        response.data.forEach((user: User) => {
          uniqueUsersMap.set(user._id, user);
        });

        const uniqueUsers = Array.from(uniqueUsersMap.values());
        setUsers(uniqueUsers);
      } catch (err) {
        setError('Error fetching senders');
      } finally {
        setLoading(false);
      }
    };

    fetchSenders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chat-list">
      {users.map((user: User) => (
        <ChatItem
          key={user._id}
          id={user._id}
          avatar={user.imageUrl}
          alt={user.username}
          title={user.username}
          date={new Date()} // Add actual date if needed
          unread={0} // Add actual unread count if needed
          className="chat-item" // Add a class for custom styling
          onClick={() => onSelectUser(user)} // Handle click to select user
        />
      ))}
    </div>
  );
};

export default UserList;
