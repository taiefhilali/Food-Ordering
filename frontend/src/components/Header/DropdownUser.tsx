import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    email: '',
    username: '',
    imageUrl: '',
    userType: '' // Add imageUrl to user state

  });

  const trigger = useRef(null);
  const dropdown = useRef(null);
  // Function to fetch user data
  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');

      if (!userId || !token) {
        throw new Error('No userId or token found');
      }

      console.log('userId:', userId); // Log userId for debugging
      console.log('token:', token);   // Log token for debugging

      const url = `http://localhost:7000/api/my/user/${userId}`;
      console.log('Request URL:', url); // Log request URL for debugging

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;

      // Store relevant user data in localStorage
      localStorage.setItem('userType', userData.userType);
      localStorage.setItem('firstname', userData.firstname);
      localStorage.setItem('lastname', userData.lastname);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('phoneNumber', userData.phoneNumber);
      localStorage.setItem('imageUrl', userData.imageUrl);

      setUserDetails({
        ...response.data,

      });

  
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {

    fetchUserData();

  }, []);


  const handleLogout = () => {
    // Perform logout logic here
    // For example: Clear user details from local storage and redirect to login page
    window.location.href = '/'; // Redirect to login page
  };
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target))
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  return (
    <>
      {userDetails && (<div className="relative">
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          to="#"
        >
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              <p>{userDetails.username}</p>
            </span>
            <span className="block text-xs">{userDetails.userType}</span>
          </span>

          <span className="h-12 w-12 rounded-full overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={userDetails.imageUrl}
              alt="User"
            />
          </span>


          <svg
            className="hidden fill-current sm:block"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
              fill=""
            />
          </svg>
        </Link>

        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen === true ? 'block' : 'hidden'
            }`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Profile Icon SVG Path */}
                </svg>
                My Profile
              </Link>
            </li>
            {/* Other List Items */}
          </ul>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-600 py-3 px-6 duration-300 ease-in-out transition-colors"
          >
            Logout
          </button>      </div>
      </div>)}


    </>

  );
};

export default DropdownUser;
