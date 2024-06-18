import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import DiprellaLogo from '../../assets/quick.png'; // Replace with actual logo path
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa'; // Import social icons as needed
import Swal from 'sweetalert2';

type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login based on provider (e.g., Facebook, Google, Twitter)
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal container */}
      <div className="bg-slate-200 text-black p-8 rounded shadow-lg z-50 w-full max-w-xl">
        {/* Close button */}
        <div className="flex justify-end">
          <button
            className="text-black hover:text-gray-300 focus:outline-none"
            onClick={closeModal}
          >
            Close
          </button>
        </div>

        {/* Diprella logo and title */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <img src={DiprellaLogo} alt="Diprella Logo" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold">Login to Your Account</h2>
        </div>

        {/* Social login buttons */}
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            onClick={() => handleSocialLogin('facebook')}
          >
            <FaFacebook className="mr-2" /> Facebook
          </button>
          <button
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => handleSocialLogin('google')}
          >
            <FaGoogle className="mr-2" /> Google
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-300 text-white px-4 py-2 rounded flex items-center"
            onClick={() => handleSocialLogin('twitter')}
          >
            <FaTwitter className="mr-2" /> Twitter
          </button>
        </div>

        {/* New Here? Sign up message */}
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <p className="text-sm">New Here?</p>
            <p className="text-xs">Register and discover a great amount of new opportunities!</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`mr-4 px-4 py-2 rounded ${
              activeTab === 'login' ? 'bg-white text-orange-500' : 'text-gray-700 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === 'register' ? 'bg-white text-orange-500' : 'text-gray-700 hover:text-gray-300'
            }`}
            onClick={() => handleTabChange('register')}
          >
            Register
          </button>
        </div>

        {/* Form content based on activeTab */}
        <div className="px-4 flex flex-col space-y-4">
          {activeTab === 'login' && <LoginForm closeModal={closeModal} />}
          {activeTab === 'register' && <RegisterForm closeModal={closeModal} />}
        </div>
      </div>
    </div>
  );
};

export default LoginFormModal;
