import  { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/my/auth/login', {
        email: email,
        password: password,
      });
  
      if (response && response.data) {
        const userToken = response.data.userToken;
        const userId = response.data._doc._id;  // Safely extract userId
  
        if (!userId) {
          console.error('User ID is not found in the response data');
          return;
        }
        localStorage.setItem('userToken', userToken);
        console.log('User token:', userToken);
        console.log('User ID:', userId);  // Log userId for debugging purposes
  
        // Store the token in localStorage
        localStorage.setItem('userId', userId);

        // Save user email and userId to localStorage upon successful login
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, userId: userId }));
  
        console.log('User logged in successfully:', response.data);
        // Optionally, you can redirect the user to another page upon successful login
      } else {
        console.log('Empty response data');
      }
    } catch (error) {
      console.log('Error logging in:', error);
    }
  };
  
  

  return (
    <div>
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
  );
};

export default LoginForm;
