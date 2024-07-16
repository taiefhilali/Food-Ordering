// components/UserList/UserList.tsx
import React, { useEffect, useState } from 'react';
import './userList.css';
import axios from 'axios';
import { ChatItem } from 'react-chat-elements'; // Import ChatItem component

interface User {
  _id: string;
  username: string;
  imageUrl: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/my/messages/fetch-senders');
        setUsers(response.data);
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
    <div className="user-list">
    {users.map((user: User) => (
      <ChatItem
        key={user._id}
        id={user._id} // Provide the id property
        avatar={user.imageUrl}
        alt={user.username}
        title={user.username}
        // subtitle={'Subtitle text'} // Replace with actual subtitle if needed
        // date={new Date()} // Replace with actual date if needed
        unread={0} // Replace with actual unread count if needed
        className="user-chat-item" // Add a class for custom styling
      />
    ))}
  </div>
  );
};

export default UserList;
