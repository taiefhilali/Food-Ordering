// import LoginFormModal from '@/forms/manage-user-form/LoginFormModal';
// import { Button } from './ui/button';

// import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';

// export default function MainNav() {

//     const navigate = useNavigate();
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const closeModal = () => {
//       setIsModalOpen(false);
//     };
//     const handleRedirectToAuth = () => {
//         navigate('/authentication');
//       };
//       const openModal = () => {
//         setIsModalOpen(true);
//       };
//     // const navigate = useNavigate();
//     // const { signOut } = useClerk();

//     // const handleSignOut = async () => {
     
//     //     // Sign out using Clerk
//     //     await signOut();

//     //     // Redirect after sign out
//     //     navigate('/');
//     // };

//     return ( <>
//     <div>
//       <Button
//         variant="ghost"
//         onClick={openModal}
//         className="mt-6 border-slate-400 text-white font-semibold py-2 rounded hover:bg-orange-300"
//       >
//         Login
//       </Button>

//       {isModalOpen && (
//             <LoginFormModal closeModal={closeModal} />
//           )}
//     </div>
//     {/* <Button variant={'ghost'} className='font-bold hover:text-orange-400 hover:bg-white'>
//   <div><SignedOut>
//                 <SignInButton />

//             </SignedOut>
//             <SignedIn>
//                 <UserButton/>
//             </SignedIn> </div>
// <Auth></Auth>  
 
//         </Button> */}
//                                 {/* <section><LoginFormModal></LoginFormModal></section> */}

      

// </>
//     );
// }
import React, { useState } from "react";
import "../assets/css/navbar.css";
import { Link } from "react-router-dom";
import LoginFormModal from "@/forms/manage-user-form/LoginFormModal";
import { Button } from "./ui/button";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="navbar">
     
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
     
        {/* Replace the button with your custom login button */}
        <Button
          variant="ghost"
          onClick={openModal}
          className="bg-slate-500 border-b-meta-7 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </Button>
        {isModalOpen && <LoginFormModal closeModal={closeModal} />}
      </div>
    </div>
  );
};

export default Navbar;
