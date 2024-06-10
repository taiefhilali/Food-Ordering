import  { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
        console.log('Attempting to log in');  // Log before request

        const response = await axios.post('http://localhost:7000/api/my/auth/login', {
            email: email,
            password: password,
        });

        console.log('Response received from login endpoint');  // Log after request

        if (response && response.data) {
            console.log('Response Data:', response.data);  // Log entire response data for debugging

            const userToken = response.data.userToken;
            const userId = response.data._id;  // Access the user ID directly

            if (!userId) {
                console.error('User ID is not found in the response data');
                return;
            }

            // Store the token and userId in localStorage
            localStorage.setItem('userToken', userToken);
            localStorage.setItem('userId', userId);

            console.log('User token:', userToken);
            console.log('User ID:', userId);

            // Save user email and userId to localStorage upon successful login
            localStorage.setItem('loggedInUser', JSON.stringify({ email: email, userId: userId }));

            console.log('User logged in successfully:', response.data);
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
