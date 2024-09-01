import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../assets/css/users.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBan } from '@fortawesome/free-solid-svg-icons';

type User = {
  blocked: any;
  firstname: string;
  lastname: string;
  imageUrl: string | undefined;
  _id: string;
  username: string;
  email: string;
  userType: string;
};

const ClientsDisplay: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.get('http://localhost:7000/api/my/user/clients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f2ab48',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:7000/api/my/user/delete/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);

        Swal.fire('Deleted!', 'Your user has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire('Error!', 'There was an error deleting your user.', 'error');
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Perform block user operation (Example: send a request to block user endpoint)
      // Replace the URL with your actual endpoint
      await axios.put(`http://localhost:7000/api/my/user/block/${userId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update local state after blocking user
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, blocked: true } : user
      );
      setUsers(updatedUsers);

      Swal.fire('Blocked!', 'User has been blocked.', 'success');
    } catch (error) {
      console.error('Error blocking user:', error);
      Swal.fire('Error!', 'There was an error blocking the user.', 'error');
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Table" />
      <div className="user-table-container">
        <ul className="user-cards">
          {users.map((user) => (
            <li key={user._id} className="user-card">
              <div className="user-card-actions">
                <button onClick={() => handleDelete(user._id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                </div>
                <div className="user-card-block">
                <button onClick={() => handleBlock(user._id)}>
                  <FontAwesomeIcon icon={faBan} />
                </button>
              </div>
              <div className="user-card-content">
                {user.imageUrl && (
                  <img src={user.imageUrl} alt={user.username} className="user-avatar" />
                )} 
                <span className="user-type-badge">{user.userType}</span>
                <div className="user-info">
                  <p className="user-name">{user.firstname + ' ' + user.lastname}</p>
                  <p>{user.username}</p>
                  <p className="user-email">{user.email}</p>
                  {user.blocked && (
                  <span className="blocked-badge">Blocked</span>
                )}
                 
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DefaultLayout>
  );
};

export default ClientsDisplay;
