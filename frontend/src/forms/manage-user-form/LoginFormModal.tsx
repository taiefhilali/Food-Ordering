import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import heroAnimation from '../../assets/heroAnimation1.json';
import Google from "../../assets/img/Google.png";
import Facebook from "../../assets/img/Facebook.png";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../../assets/css/loginmodal.css'// Import Clerk's default CSS

type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useUser();
  const navigate = useNavigate();

  const google = () => {
    window.open("http://localhost:7000/auth/google", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:7000/auth/facebook", "_self");
  };

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

  useEffect(() => {
    const handleSignIn = async () => {
      try {
        if (user) {
          const userId = user.id; // Clerk user ID
          const email = user.emailAddresses[0].emailAddress; // User's email address
          const token = user.publicMetadata.token; // Token in user metadata
          const userType = 'Vendor'; // Example userType
          const username = user.username; // User's username

          // Send user data to backend
          const response = await fetch('http://localhost:7000/api/my/auth/clerk-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              email,
              token,
              userType,
              username,
            }),
          });

          if (response.ok) {
            console.log('User data sent to backend successfully');
            navigate('/settings'); // Redirect to /settings on successful authentication
          } else {
            console.error('Failed to send user data to backend');
          }
        }
      } catch (error) {
        console.error('Error handling sign in:', error);
      }
    };

    handleSignIn();
  }, [user, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white text-black p-8 rounded shadow-lg z-50 flex w-full max-w-3xl border-2 border-t-slate-300">
        <div className="flex-shrink-0 w-1/2 rounded-lg overflow-hidden">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div>
        <div className="flex-grow px-4">
          <div className="flex justify-end">
            <button
              className="text-black hover:text-gray-300 focus:outline-none"
              onClick={closeModal}
            >
              X
            </button>
          </div>
          <div className="flex flex-col items-center mt-4 mb-6">
            <h2 className="text-2xl font-bold">Login to Your Account</h2>
          </div>
          <div className="flex justify-center mb-6 space-x-4">
            <SignInButton>
              <button className='custom-sign-in-button'>Sign in with Clerk</button>
            </SignInButton>
            <UserButton />
            <div className="loginButton google flex items-center space-x-2" onClick={google}>
              <img src={Google} alt="" className="icon" style={{ height: '40px', width: '40px' }} />
            </div>
            <div className="loginButton facebook flex items-center space-x-2" onClick={facebook}>
              <img src={Facebook} alt="" className="icon" style={{ height: '40px', width: '40px' }} />
            </div>
          </div>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          <div className="flex justify-center mb-6">
            <button
              className={`mr-4 px-4 py-2 rounded ${activeTab === 'login' ? 'bg-white text-orange-500' : 'text-orange-500 hover:text-orange-300'}`}
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'register' ? 'bg-white text-orange-500' : 'text-orange-500 hover:text-orange-300'}`}
              onClick={() => handleTabChange('register')}
            >
              Register
            </button>
          </div>
          <div className="px-4 flex flex-col space-y-4">
            {activeTab === 'login' && <LoginForm closeModal={closeModal} />}
            {activeTab === 'register' && <RegisterForm closeModal={closeModal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormModal;
