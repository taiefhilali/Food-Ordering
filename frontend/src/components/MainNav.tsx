import React, { useState } from "react";
import "../assets/css/navbar.css";
import { Link } from "react-router-dom";
import LoginFormModal from "@/forms/manage-user-form/LoginFormModal";
import { Button } from "./ui/button";
import "../assets/css/mainnav.css"
const Navbar = () => {
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
          About
        </a>
        <a
          href="#explore-partnerships"
          onClick={() => setMenu("partnership")}
          className={menu === "partnership" ? "active" : ""}
        >
          Partnerships
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
      
      <div className="navbar-right">
        <Button
          variant="ghost"
          onClick={openModal}
          className="bg-black border-b-meta-7 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </Button>
        {isModalOpen && <LoginFormModal closeModal={closeModal} />}
      </div></ul>
    </div>
  );
};

export default Navbar;
