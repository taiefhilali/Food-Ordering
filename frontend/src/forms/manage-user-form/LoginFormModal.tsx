import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const LoginFormModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    let isValid = true;
    const updatedErrors = { email: '', password: '' };

    if (!email) {
      updatedErrors.email = 'Email is required';
      isValid = false;
    }

    if (!password) {
      updatedErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/my/user/login', {
        email,
        password,
      });

      console.log('User logged in successfully:', response.data);

      localStorage.setItem('loggedInUser', JSON.stringify({ email }));

      setShowModal(false);
      navigate('/dashboard');

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome! You are now logged in.',
      });

    } catch (error) {
      console.log('Error logging in');

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600"
      >
        Login
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="modal-container bg-white w-96 mx-auto rounded-lg z-50 p-4">
            <span
              className="modal-close absolute top-0 right-0 cursor-pointer text-gray-400 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              &times;
            </span>
            <h2 className="text-2xl font-semibold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full mb-3 p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full mb-3 p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-slate-400 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginFormModal;
