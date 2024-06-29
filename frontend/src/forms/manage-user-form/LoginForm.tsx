import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ForgotPasswordPage from '@/components/Authentication/forgotPassword';
import Input from '../../components/Inputs/LoginInput';
import { EyeOff, Eye } from 'lucide-react';

type LoginFormProps = {
  closeModal: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ closeModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to manage showing ForgotPasswordPage
  const navigate = useNavigate();
  const [type, setType] = useState('password');

  const handleToggle = () => {
    if (type === 'password') {
      setType('text');
    } else {
      setType('password');
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Attempting to log in');
      const token = localStorage.getItem('userToken');

      const response = await axios.post('http://localhost:7000/api/my/auth/log', {
        email: email,
        password: password,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
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
        const { firstname, lastname } = response.data;
        console.log('================usernamme====================');
        console.log(response.data);
        console.log('====================================');
        // Store token and user info in local storage
        localStorage.setItem('firstname', firstname);
        localStorage.setItem('lastname', lastname);
        localStorage.setItem('userToken', userToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('loggedInUser', JSON.stringify({ email: email, userId: userId }));

        console.log('User logged in successfully:', response.data);

        // Show success message using SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'You have successfully logged in.',
          buttonsStyling: true,
          confirmButtonColor: '#ff6411'
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
          confirmButtonColor: '#ff6411'
          ,
        });
      }
    } catch (error) {
      console.log('Error logging in:', error);
      // Show error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Error logging in. Please try again later.',
        confirmButtonColor:'#ff6411'

      });
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword); // Toggle the state to show/hide ForgotPasswordPage
  };

  return (
    <div>
      {showForgotPassword ? (
        <ForgotPasswordPage /> // Render ForgotPasswordPage if showForgotPassword is true
      ) : (
        <>
          <div>
            <Input
              type="email"
              placeholder="Type your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: '16px' }} // Add your desired gap here
            />
            <div className="relative">
              <Input
                type={type}
                placeholder="Type your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={handleToggle}>
                {type === 'password' ? <EyeOff size={25} /> : <Eye size={25} />}
              </span>
            </div>
          </div>

          <div className="mt-4 text-right text-sm">
            <Link to="#" onClick={toggleForgotPassword} className="text-orange-500">
              Forgot Password?
            </Link>
          </div>
          <button
            onClick={handleLogin}
            className="bg-white text-orange-500 hover:text-orange-300 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default LoginForm;
