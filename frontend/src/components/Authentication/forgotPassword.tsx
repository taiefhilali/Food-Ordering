/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, ] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email'); // 'email' for entering email, 'reset' for resetting password

  const navigate = useNavigate();

  const sendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');

      const response = await axios.post('http://localhost:7000/api/my/auth/forgot-password', {
        email: email,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
      });
      // setResetToken(response.data.resetToken);
      setStep('reset');
    } catch (err) {
      console.error('Error sending reset email:');
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');

      await axios.post('http://localhost:7000/api/my/auth/reset-password', {
        email: email,
        token: resetToken,
        newPassword: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
      });
      navigate('/login'); // Redirect to login page after successful password reset
    } catch (err) {
      console.error('Error resetting password:');
    }
  };

  return (
    <div
      style={{
        margin: 'auto',
        maxWidth: '500px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
      }}
    >
      <h1 style={{ color: 'orange', textAlign: 'center' }}>
        {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
      </h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
        onSubmit={step === 'email' ? sendResetEmail : resetPassword}
      >
        {step === 'email' && (
          <>
            <label htmlFor='email'>Please provide your email address</label>
            <input
              type='email'
              placeholder='e.g john@doe.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px' }}
            />
            <button
              style={{
                backgroundColor: 'white',
                color: 'orange',
                padding: '10px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Send password reset email
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <label htmlFor='resetToken'>Enter the password reset token</label>
            <input
              type='text'
              placeholder='Enter token'
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              style={{ padding: '8px' }}
            />

            <label htmlFor='newPassword'>Enter your new password</label>
            <input
              type='password'
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '8px' }}
            />

            <button
              style={{
                backgroundColor: 'orange',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Reset Password
            </button>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
