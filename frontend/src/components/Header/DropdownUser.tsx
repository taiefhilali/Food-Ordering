import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DropdownUser = () => {
  const [userDetails, setUserDetails] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    email: '',
    username: '',
    imageUrl: '',
    userType: ''
  });

  const linkRef = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      if (!dropdown.current || !target) return;

      if (
        dropdown.current.contains(target) ||
        (trigger.current && trigger.current.contains(target)) ||
        linkRef.current?.contains(target)
      ) {
        return;
      }

      setDropdownOpen(false);
    };

    document.addEventListener('click', clickHandler);

    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');

      if (!userId || !token) {
        throw new Error('No userId or token found');
      }

      const url = `http://localhost:7000/api/my/user/${userId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserDetails(response.data);
      localStorage.setItem('userType', response.data.userType);
      localStorage.setItem('firstname', response.data.firstname);
      localStorage.setItem('lastname', response.data.lastname);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('phoneNumber', response.data.phoneNumber);
      localStorage.setItem('imageUrl', response.data.imageUrl);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Clear user details from local storage and redirect to login page
    localStorage.clear();
    window.location.href = '/';
  };

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (!dropdownOpen || event.key !== 'Escape') return;
      setDropdownOpen(false);
    };

    document.addEventListener('keydown', keyHandler);

    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  return (
    <>
      {userDetails && (
        <div className="relative">
          <Link
            ref={linkRef}
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
              />
            </svg>
          </Link>

          <div
            ref={dropdown}
            className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${dropdownOpen ? 'block' : 'hidden'}`}
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
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DropdownUser;
