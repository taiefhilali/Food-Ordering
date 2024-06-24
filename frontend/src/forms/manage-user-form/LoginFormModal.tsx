import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import heroAnimation from '../../assets/heroAnimation1.json'; // Replace with actual path to Lottie JSON file
import axios from 'axios';
import Google from "../../assets/img/Google.png";
// import Facebook from "../img/facebook.png";
// import Github from "../img/github.png";
type LoginFormModalProps = {
  closeModal: () => void;
};

const LoginFormModal: React.FC<LoginFormModalProps> = ({ closeModal }) => {
  const [activeTab, setActiveTab] = useState('login');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem('userToken');

      if ( !token) {
        console.error('No userId or token found');
        return;
      }

      fetch("http://localhost:7000/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("authentication has been failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getUser();
  }, []);
  const google = () => {
    window.open("http://localhost:7000/auth/google", "_self");
  };

  // const github = () => {
  //   window.open("http://localhost:5000/auth/github", "_self");
  // };

  // const facebook = () => {
  //   window.open("http://localhost:5000/auth/facebook", "_self");
  // };

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

  // const handleFacebookLogin = async () => {
  //   try {
  //     const response = await axios.post('http://localhost:3000/facebook/token');
  //     const { token } = response.data;
  //     localStorage.setItem('token', token); // Store token in localStorage
  //     // Optionally, redirect or update state upon successful login
  //   } catch (error) {
  //     console.error('Facebook login error:', error);
  //     // Handle error (e.g., show error message to the user)
  //   }
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div> 

      {/* Modal container */}
      <div className="bg-white text-black p-8 rounded shadow-lg z-50 flex w-full max-w-3xl border-2 border-t-slate-300">
        {/* Animation section */}
        <div className="flex-shrink-0 w-1/2 rounded-lg overflow-hidden">
          <Lottie options={defaultOptions} height="100%" width="100%" />
        </div >
        <div className="wrapper" >
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
          {/* <div className="loginButton facebook" onClick={facebook}>
            <img src={Facebook} alt="" className="icon" />
            Facebook
          </div>
          <div className="loginButton github" onClick={github}>
            <img src={Github} alt="" className="icon" />
            Github
          </div> */}
        </div>
    
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

          {/* OAuth Buttons */}
          <div className="px-4 flex flex-col space-y-4">
            {/* <button className="w-full px-4 py-2 text-white bg-blue-600 rounded" onClick={handleFacebookLogin}>
              Login with Facebook
            </button> */}

            {/* Form content based on activeTab */}
            {activeTab === 'login' && <LoginForm closeModal={closeModal} />}
            {activeTab === 'register' && <RegisterForm closeModal={closeModal} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormModal;
