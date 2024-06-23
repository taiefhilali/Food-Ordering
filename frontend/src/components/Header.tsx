import { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileNav from './MobileNav';
import MainNav from './MainNav';

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-transparent fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center py-4">
        {/* Logo or Branding */}
        <Link to="/" className="text-3xl font-bold text-orange-500 hover:text-orange-300 transition duration-300">
          QuickBite
        </Link>

        {/* Hamburger Menu Button (visible on mobile) */}
        <div className="md:hidden cursor-pointer" onClick={toggleMobileMenu}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </div>

        {/* Navigation Menu (visible on larger screens) */}
        <nav className="hidden md:flex space-x-4">
          {/* <Link to="/" className="text-white hover:text-gray-300 transition duration-300">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300 transition duration-300">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300 transition duration-300">
            Contact
          </Link> */}

          <div className='md:hidden'><MobileNav /></div>
          <div className='hidden md:block'><MainNav /></div>

        </nav>

        {/* Mobile Navigation Menu (hidden on larger screens) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 bg-white p-4 shadow-md">
            <Link to="/" className="block text-gray-800 py-2">
              Home
            </Link>
            <Link to="/about" className="block text-gray-800 py-2">
              About
            </Link>
            <Link to="/contact" className="block text-gray-800 py-2">
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
