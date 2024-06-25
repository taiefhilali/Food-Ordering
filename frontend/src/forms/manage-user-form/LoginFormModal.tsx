import React, {  useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import heroAnimation from '../../assets/heroAnimation1.json'; // Replace with actual path to Lottie JSON file
import Google from "../../assets/img/Google.png";
import Facebook from "../../assets/img/Facebook.png";
// import Github from "../img/github.png";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";

type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');
  const { user } = useUser();

  const google = () => {
    window.open("http://localhost:7000/auth/google", "_self");
  };

  // const github = () => {
  //   window.open("http://localhost:5000/auth/github", "_self");
  // };

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
          const userId = user.id; // This is the Clerk user ID
          const email = user.emailAddresses[0].emailAddress// User's email address
          const token = user.publicMetadata.token; // Assuming you have a token in user metadata
          const userType='Vendor';
          const username=user.username;

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
              username
            }),
          });

          if (response.ok) {
            console.log('User data sent to backend successfully');
          } else {
            console.error('Failed to send user data to backend');
          }
        }
      } catch (error) {
        console.error('Error handling sign in:', error);
      }
    };

    handleSignIn();
  }, [user]);


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
  
        {/* OAuth Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
           {/* Clerk Sign In Button */}
            <SignInButton />
              
              {/* Clerk User Button */}
              <UserButton />
          <div className="loginButton google flex items-center space-x-2" onClick={google}>
          <img src={Google} alt="" className="icon" style={{ height: '40px', width: '40px' }} />
          </div>
          <div className="loginButton facebook flex items-center space-x-2" onClick={facebook}>
            <img src={Facebook} alt="" className="icon"  style={{ height: '40px', width: '40px' }} />
          </div>
        </div>
  
        {/* OR divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-400"></div>
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
          {activeTab === 'register' && <RegisterForm closeModal={closeModal} />}
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default LoginFormModal;
