import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import DiprellaLogo from '../../assets/quick.png'; // Replace with actual logo path

type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');
  // const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);
  // const [selectedUserType, setSelectedUserType] = useState('');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // const handleUserTypeSelection = (userType: string) => {
  //   setSelectedUserType(userType);
  //   setShowUserTypeSelector(false);
  // };

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
          {activeTab === 'register' && (
            <RegisterForm
              closeModal={closeModal}
              // showUserTypeSelection={() => setShowUserTypeSelector(true)} // Show user type selection
            />
          )}
        </div>

        {/* User type selection */}
      
   
      </div>
    </div>
  );
};

export default LoginFormModal;
