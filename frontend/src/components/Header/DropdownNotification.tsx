import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

// Define Notification interface
interface Notification {
  event: string;
  data: any; // Adjust data type as per your application
  timestamp: Date;
  user: string;
}

const userToken = localStorage.getItem('userToken');

// Replace with your server's URL
const socket = io('http://localhost:8000', {
  extraHeaders: {
    Authorization: `Bearer ${userToken}`,
  },
});

const DropdownNotification: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<HTMLAnchorElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || (trigger.current && trigger.current.contains(target))) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    // Fetch notifications based on user ID using Axios
    const fetchNotifications = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');

        if (!userId) {
          throw new Error('No userId found');
        }

        const response = await axios.get('http://localhost:7000/api/my/notifications/all', {
          params: { userId },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const fetchedNotifications: Notification[] = response.data; // Specify the type of fetchedNotifications

        fetchedNotifications.sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateB.getTime() - dateA.getTime();
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications(); // Call the fetch function on component mount

    // Listen for socket events
    socket.on('messages', (notificationData: Notification) => {
      console.log('New message received:', notificationData);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { event: notificationData.event, data: notificationData.data, timestamp: notificationData.timestamp, user: notificationData.user },
      ]);
    });

    // Clean up socket listeners
    return () => {
      socket.off('messages');
    };
  }, []); // Empty dependency array ensures this effect runs only once
  return (
    <li className="relative">
      <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false); // Optionally manage notifying state
          setDropdownOpen(!dropdownOpen);
        }}
        to="#"
        className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
      >
        <span
          className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${notifying === false ? 'hidden' : 'inline'
            }`}
        >
          <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
        </span>

        <svg
          className="fill-current duration-300 ease-in-out"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
            fill=""
          />
        </svg>
      </Link>

      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-27 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${dropdownOpen === true ? 'block' : 'hidden'
          }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Notifications</h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          {notifications.map((notification, index) => (
            <li key={index} className="relative">
              <Link
                className="flex flex-col gap-2.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                to="#"
              >
                <div className="flex justify-items-start items-start ">
                <div  className="text-orange-500 dark:text-white font-extrabold text-base text-center"> {'🍴'+ ' '+ ' '+notification.data.name}</div>
                  <span className="text-black dark:text-white font-extralight text-base">
                    {'is added successfully   '}
                  </span>
                  <img
                    src={notification.data.imageUrl}
                    alt={notification.data.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {new Date(notification.timestamp).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </li>
  );
};

export default DropdownNotification;
