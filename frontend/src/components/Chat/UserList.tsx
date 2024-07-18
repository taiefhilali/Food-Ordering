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
        const response = await axios.get<User[]>('http://localhost:7000/api/my/messages/fetch-senders');

        // Get the user ID from localStorage
        const loggedInUserId = localStorage.getItem('userId');

        if (loggedInUserId) {
          // Use a Set to filter out duplicate users and exclude the logged-in user
          const uniqueUsersSet = new Set<string>();
          response.data.forEach((user) => {
            if (user._id !== loggedInUserId && !uniqueUsersSet.has(user._id)) {
              uniqueUsersSet.add(user._id);
            }
          });

          // Convert Set back to array and update state
          const filteredUsers = Array.from(uniqueUsersSet).map(userId => response.data.find(user => user._id === userId)!);
          setUsers(filteredUsers);
        } else {
          setError('User ID not found in localStorage');
        }
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
