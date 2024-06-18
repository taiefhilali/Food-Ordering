import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type LoginFormProps = {
  closeModal: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in');

      const response = await axios.post('http://localhost:7000/api/my/auth/log', {
        email: email,
        password: password,
      });

      console.log('Response received from login endpoint');

      if (response && response.data) {
        console.log('Response Data:', response.data);

        const userToken = response.data.userToken;
        const userId = response.data._id;

        if (!userId) {
          console.error('User ID is not found in the response data');
          return;
        }

        localStorage.setItem('userToken', userToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, userId: userId }));

        console.log('User logged in successfully:', response.data);

        // Show success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You have successfully logged in.',
        }).then(() => {
          navigate('/settings');
          closeModal(); // Call closeModal when login is successful
        });
      } else {
        console.log('Empty response data');
        // Show error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.log('Error logging in:', error);
      // Show error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Error logging in. Please try again later.',
      });
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full px-4 py-2 border rounded mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full px-4 py-2 border rounded mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-orange-500 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default LoginForm;
