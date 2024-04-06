import React, { useState } from 'react';
import axios from 'axios';
import './LoginFormModal.css'; // Import CSS file for modal styling

const LoginFormModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/my/user/login', {
        email,
        password,
      });

      console.log('User logged in successfully:', response.data);

      // Save user data to localStorage upon successful login
      localStorage.setItem('loggedInUser', JSON.stringify({ email, password }));

      // Close the modal after successful login
      setShowModal(false);

      // Optionally, you can redirect the user to another page upon successful login
    } catch (error) {
      console.log('Error logging in');
    }
  };

  return (
    <>
      {/* Button to open the login form modal */}
      <button onClick={() => setShowModal(true)}>Login</button>

      {/* Modal container */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginFormModal;
