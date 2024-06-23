import React, { useState } from 'react';
import Lottie from 'react-lottie';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import heroAnimation from '../../assets/heroAnimation1.json'; // Replace with actual path to Lottie JSON file

type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: heroAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Modal container */}
      <div className="bg-white text-black p-8 rounded shadow-lg z-50 flex w-full max-w-3xl border-2 border-t-slate-300">
        {/* Animation section */}
        <div className="flex-shrink-0 w-1/2 rounded-lg overflow-hidden">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>

        {/* Content section */}
        <div className="flex-grow px-4">
          {/* Close button */}
          <div className="flex justify-end">
            <button
              className="text-black hover:text-gray-300 focus:outline-none"
              onClick={closeModal}
            >
              X
            </button>
          </div>

          {/* Diprella logo and title */}
          <div className="flex flex-col items-center mt-4 mb-6">
            <h2 className="text-2xl font-bold">Login to Your Account</h2>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              className={`mr-4 px-4 py-2 rounded ${
                activeTab === 'login' ? 'bg-white text-orange-500' : 'text-orange-500 hover:text-orange-300'
              }`}
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded ${
                activeTab === 'register' ? 'bg-white text-orange-500' : 'text-orange-500 hover:text-orange-300'
              }`}
              onClick={() => handleTabChange('register')}
            >
              Register
            </button>
          </div>

          {/* Form content based on activeTab */}
          <div className="px-4 flex flex-col space-y-4">
            {activeTab === 'login' && <LoginForm closeModal={closeModal} />}
            {activeTab === 'register' && (
              <RegisterForm closeModal={closeModal} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormModal;
