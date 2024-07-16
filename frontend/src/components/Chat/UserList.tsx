import React, { useEffect, useState } from 'react';
 import './userList.css';
import axios from 'axios';
import Members from '@/components/Members'; // Import Members component

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
    <div>
      {users.map((user: User) => (
        <div key={user._id} className="member">
          <img src={user.imageUrl} alt={user.username} className="avatar" />
          <div className="user-details">
            <span className="username">{user.username}</span>
          </div>
        </div>
      ))}
      {/* Replace with Members component */}
      <Members members={[]} me={{ id: '' }} />
    </div>
  );
};

export default UserList;
