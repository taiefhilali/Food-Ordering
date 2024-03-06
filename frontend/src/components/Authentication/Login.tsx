import React, { useState } from 'react';
import { SignIn, useClerk } from '@clerk/clerk-react';
import ForgotPasswordPage from './forgotPassword';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Use Clerk's signIn method to handle authentication
    <SignIn></SignIn>

      // Redirect or perform any action after successful login
      console.log('Login successful');
    } catch (error) {
      // Handle login errors
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          width: '300px',
        }}
      >
        <h2 style={{ color: 'orange', textAlign: 'center' }}>Login</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px' }}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px' }}
          />

          <button
            type="button"
            onClick={handleLogin}
            style={{
              backgroundColor: 'yellow',
              color: 'orange',
              padding: '10px',
              cursor: 'pointer',
              border: 'none',
              borderRadius: '5px',
            }}
          >
            Login
          </button>
        </form>
      </div>

      <ForgotPasswordPage />
    </div>
  );
};


export default Login;
