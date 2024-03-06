// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Define the type for the styles
interface SidebarStyle {
  backgroundColor: string;
  padding: string;
  borderRadius: string;
  width: string;
  display: string;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems: string;
}

const Sidebar = () => {
  // Apply the SidebarStyle type to the inline styles
  const sidebarStyle: SidebarStyle = {
    backgroundColor: 'orange',
    padding: '20px',
    borderRadius: '15px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column', // Change to the appropriate value
    alignItems: 'center',
  };

  // Define link style
  const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    padding: '10px',
    margin: '5px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '100%',
    backgroundColor: 'yellow',
    transition: 'background-color 0.3s ease',
  };

  return (
    <div style={sidebarStyle}>
      <Link to="/dashboard" style={linkStyle}>
        Dashboard
      </Link>
      <Link to="/manage-restaurant" style={linkStyle}>
        Manage Restaurant
      </Link>
      {/* Add other sidebar links as needed */}
    </div>
  );
};

export default Sidebar;
