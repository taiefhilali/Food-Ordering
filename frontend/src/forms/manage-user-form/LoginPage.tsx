import React, { useState } from 'react';
import Modal from 'react-modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

Modal.setAppElement('#root'); // Set the root element for accessibility

const LoginPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const showUserTypeSelection = () => {
    // Define your logic here to show the user type selection
    console.log('Showing user type selection...');
  };

  return (
    <div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('login')}>
        Login
      </button>
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal('register')}>
        Register
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Login or Register Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="modal-header bg-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {activeTab === 'login' ? 'Login' : 'Register'}
          </h2>
          <button className="text-gray-800 hover:text-gray-900" onClick={closeModal}>
            Close
          </button>
        </div>
        <div className="modal-body p-4">
          {activeTab === 'login' && <LoginForm closeModal={closeModal} />}
          {activeTab === 'register' && <RegisterForm closeModal={closeModal} showUserTypeSelection={showUserTypeSelection} />} {/* Pass showUserTypeSelection prop */}
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
