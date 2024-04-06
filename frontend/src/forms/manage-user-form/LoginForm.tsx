import  { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:7000/api/my/user/login', {
        email: email,
        password: password,
      });

      console.log('User logged in successfully:', response.data);

      // Save user data to localStorage upon successful login
      localStorage.setItem('loggedInUser', JSON.stringify({ email: email, password: password }));

      // Optionally, you can redirect the user to another page upon successful login
    } catch (error) {
      console.log('Error logging in');
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
