import { Link } from 'react-router-dom';
import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { useState } from 'react';
import axios from 'axios';
import { Product } from '@/types/product';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]); // Adjust type as per your Product interface
  console.log(searchTerm);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:7000/api/my/products/search?name=${searchTerm}`);
      console.log(response.data); // Check what is being returned here
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching products:', error);
      // Handle error state
    }
  };
  return (
    
   <header className="sticky top-0 left-0 z-999 flex w-full rounded-lg bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
  <div>
    <div className="flex justify-start ml-3 mt-10"> {/* Adjust margin-top to move the entire search component down */}
  <form onSubmit={handleSearch} className="relative">
    <div className="relative">
      <button type="submit" className="absolute left-0 top-1/2 -translate-y-1/2">
        <svg
          className="fill-body hover:fill-orange-400 dark:fill-bodydark dark:hover:fill-slate-500"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
            fill=""
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
            fill=""
          />
        </svg>
      </button>

      <input
        type="text"
        placeholder="Type to search..."
        className="bg-transparent pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125   rounded-full py-2 px-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </form>
</div>

<div className="mt-4">
  {searchResults.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {searchResults.map((product) => (
        <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
           <Link to={`/product/${product._id}`}>
          <img src={product.imageUrl} alt={product.name} className="w-22 h-22 sm:h-20 object-cover" />
         </Link>
          <div className="p-2">
            <h2 className="text-gray-800 font-semibold text-xs sm:text-sm">{product.name}</h2>
            <p className="text-gray-600 text-xs">{product.description}</p>
            <p className="text-gray-700 text-sm mt-1">{product.price} dt</p>
          </div>
        </div>
      ))}
      {/* Add an additional card if there are fewer than 3 results */}
      {searchResults.length < 3 && (
        <div className="bg-gray-100 p-2 rounded-md shadow-md">
          <p className="text-center text-gray-500 text-xs">Additional product card</p>
        </div>
      )}
    </div>
  ) : (
    searchTerm.trim().length > 0 ? (
      <p className="text-center text-gray-500 mt-4">No products found</p>
    ) : (
      <p className="text-center text-gray-500 mt-4"></p>
    )
  )}
</div></div>
  <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
    <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
      {/* <!-- Hamburger Toggle BTN --> */}
      <button
        aria-controls="sidebar"
        onClick={(e) => {
          e.stopPropagation();
          props.setSidebarOpen(!props.sidebarOpen);
        }}
        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
      >
        <span className="relative block h-5.5 w-5.5 cursor-pointer">
          <span className="du-block absolute right-0 h-full w-full">
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                !props.sidebarOpen && '!w-full delay-300'
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                !props.sidebarOpen && 'delay-400 !w-full'
              }`}
            ></span>
            <span
              className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                !props.sidebarOpen && '!w-full delay-500'
              }`}
            ></span>
          </span>
          <span className="absolute right-0 h-full w-full rotate-45">
            <span
              className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                !props.sidebarOpen && '!h-0 !delay-[0]'
              }`}
            ></span>
            <span
              className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                !props.sidebarOpen && '!h-0 !delay-200'
              }`}
            ></span>
          </span>
        </span>
      </button>
      {/* <!-- Hamburger Toggle BTN --> */}

      <Link className="block flex-shrink-0 lg:hidden" to="/">
        {/* <img src={LogoIcon} alt="Logo" /> */}
      </Link>
    </div>
    {/* //typingg */}

    <div className="hidden sm:block flex-grow">

    </div>

    <div className="flex items-center gap-3 2xsm:gap-7">
      <ul className="flex items-center gap-2 2xsm:gap-4">
        {/* <!-- Dark Mode Toggler --> */}
        <DarkModeSwitcher />
        {/* <!-- Dark Mode Toggler --> */}

        {/* <!-- Notification Menu Area --> */}
        <DropdownNotification />
        {/* <!-- Notification Menu Area --> */}

        {/* <!-- Chat Notification Area --> */}
        <DropdownMessage />
        {/* <!-- Chat Notification Area --> */}
      </ul>

      {/* <!-- User Area --> */}
      <DropdownUser />
      {/* <!-- User Area --> */}
    </div>
  </div>
</header>

  );
};

export default Header;
