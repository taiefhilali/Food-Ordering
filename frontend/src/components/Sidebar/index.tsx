import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../assets/quickbitess.png';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const userType = localStorage.getItem('userType');

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute   left-0 top-0 z-9999 flex h-screen  rounded-sm  w-72.5 flex-col overflow-y-hidden bg-white duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center  justify-between  px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} style={{ marginLeft: '-0.5cm' }} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar mt-0 flex flex-col overflow-y-auto duration-300 ease-linear" style={{ marginTop: '-2cm' }}>
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-graydark">

            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              {userType === 'Vendor' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="/statsticsVendor"
                          className={`group relative flex items-center gap-2.5 rounded-full py-2 px-4 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/auth' || pathname.includes('auth')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                              fill=""
                            />
                          </svg>
                          Dashboard
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/statsticsVendor"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-bodydark2')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                    fill=""
                                  />
                                  <path
                                    d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                    fill=""
                                  />
                                </svg>
                                Statistics & Charts
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Dashboard admin--> */}
              {userType === 'Admin' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="/statsticsAdmin"
                          className={`group relative flex items-center gap-2.5 rounded-full py-2 px-4 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/auth' || pathname.includes('auth')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z"
                              fill=""
                            />
                            <path
                              d="M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z"
                              fill=""
                            />
                            <path
                              d="M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z"
                              fill=""
                            />
                          </svg>
                          Dashboard
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/statsticsAdmin"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-bodydark2')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                    fill=""
                                  />
                                  <path
                                    d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                    fill=""
                                  />
                                </svg>
                                Statistics & Charts
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* Restaurant side bar */}
              {userType === 'Vendor' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >


                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.5 1.5C2.22386 1.5 2 1.72386 2 2V4C2 4.27614 2.22386 4.5 2.5 4.5H15.5C15.7761 4.5 16 4.27614 16 4V2C16 1.72386 15.7761 1.5 15.5 1.5H2.5ZM1 5C1 4.44772 1.44772 4 2 4H16C16.5523 4 17 4.44772 17 5V15C17 15.5523 16.5523 16 16 16H2C1.44772 16 1 15.5523 1 15V5ZM3 6V14H15V6H3Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5ZM8.5 7C7.94772 7 7.5 7.44772 7.5 8C7.5 8.55228 7.94772 9 8.5 9C9.05228 9 9.5 8.55228 9.5 8C9.5 7.44772 9.05228 7 8.5 7Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6 11C6 10.7239 6.22386 10.5 6.5 10.5H12.5C12.7761 10.5 13 10.7239 13 11C13 11.2761 12.7761 11.5 12.5 11.5H6.5C6.22386 11.5 6 11.2761 6 11Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.5 12.5C6.5 12.2239 6.72386 12 7 12H11C11.2761 12 11.5 12.2239 11.5 12.5C11.5 12.7761 11.2761 13 11 13H7C6.72386 13 6.5 12.7761 6.5 12.5Z"
                              fill="currentColor"
                            />
                          </svg>

                          Restaurant
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/manage-restaurant"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400 ' +
                                  (isActive && '!text-white')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                                    fill=""
                                  />
                                  <path
                                    d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                                    fill=""
                                  />
                                </svg>
                                Add Restaurant
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/display-restaurant-details"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400 ' +
                                  (isActive && 'fill-current')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Restaurant Details
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* Products side bar */}
              {userType === 'Vendor' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" fill="#FBC02D" />
                            <path
                              d="M12 2l8 16H4L12 2z"
                              fill="#FF7043"
                            />
                            <circle cx="10" cy="10" r="2" fill="#BF360C" />
                            <circle cx="14" cy="10" r="2" fill="#BF360C" />
                            <circle cx="12" cy="14" r="2" fill="#BF360C" />
                          </svg>




                          Products
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/add-product"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400 ' +
                                  (isActive && '!fill-current')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 11H18V13H13V18H11V13H6V11H11V6H13V11Z"
                                  />
                                </svg>
                                Add Product
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/display-products"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Product Details
                              </NavLink>

                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* Categories side bar */}
              {userType === 'Vendor' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >


                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.5 1.5C2.22386 1.5 2 1.72386 2 2V4C2 4.27614 2.22386 4.5 2.5 4.5H15.5C15.7761 4.5 16 4.27614 16 4V2C16 1.72386 15.7761 1.5 15.5 1.5H2.5ZM1 5C1 4.44772 1.44772 4 2 4H16C16.5523 4 17 4.44772 17 5V15C17 15.5523 16.5523 16 16 16H2C1.44772 16 1 15.5523 1 15V5ZM3 6V14H15V6H3Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5 8.5C5 8.22386 5.22386 8 5.5 8H12.5C12.7761 8 13 8.22386 13 8.5C13 8.77614 12.7761 9 12.5 9H5.5C5.22386 9 5 8.77614 5 8.5Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5 10.5C5 10.2239 5.22386 10 5.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H5.5C5.22386 11 5 10.7761 5 10.5Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5 12.5C5 12.2239 5.22386 12 5.5 12H12.5C12.7761 12 13 12.2239 13 12.5C13 12.7761 12.7761 13 12.5 13H5.5C5.22386 13 5 12.7761 5 12.5Z"
                              fill="currentColor"
                            />
                          </svg>
                          Categories                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/manage-categories"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400 ' +
                                  (isActive && 'fill-current')
                                }
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 11H18V13H13V18H11V13H6V11H11V6H13V11Z"
                                  />
                                </svg>
                                Add Category
                              </NavLink>
                            </li>
                            <li>


                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}


              {/* Orders side bar */}
              {userType === 'Vendor' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M6 6h15l1 9H7l1-9zM6 6l1 6h12l1-6H6zM3 3h1l3 11h11l3-11h1M3 3l1 1h1l3 10h12l3-10h1l1-1" />
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="17" cy="21" r="1" />
                          </svg>



                          Orders
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                            <li>
                              <NavLink
                                to="/display-orders"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Orders Details
                              </NavLink>

                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {/* admin users */}
              {userType === 'Admin' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 2C9.22386 2 7 4.22386 7 7C7 9.77614 9.22386 12 12 12C14.7761 12 17 9.77614 17 7C17 4.22386 14.7761 2 12 2Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18 20C17.3851 18.2636 15.9541 17 14 17H10C8.04594 17 6.61489 18.2636 6 20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>


                          Users
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                            <li>
                              <NavLink
                                to="/admins"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Admins List
                              </NavLink>
                              <NavLink
                                to="/vendors"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Vendors List
                              </NavLink>
                              <NavLink
                                to="/clients"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Clients List
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {/* Admin Products side bar */}
              {userType === 'Admin' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                            <path d="M19.5 7h-2.2l-.7-1.4c-.2-.3-.5-.4-.9-.4H9.3c-.4 0-.7.1-.9.4l-.7 1.4H4.5c-.8 0-1.5.7-1.5 1.5v10c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-10c0-.8-.7-1.5-1.5-1.5zM12 4.7l.9-1.8h-1.8l.9 1.8zM18 18H6v-8h12v8zM12 9c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" fill="currentColor" />
                          </svg>


                          Products
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                            <li>
                              <NavLink
                                to="/adminproducts"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Products List
                              </NavLink>

                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {/* Admin Restaurants side bar */}
              {userType === 'Admin' && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('dashboard')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                            pathname.includes('dashboard')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M2.5 1.5C2.22386 1.5 2 1.72386 2 2V4C2 4.27614 2.22386 4.5 2.5 4.5H15.5C15.7761 4.5 16 4.27614 16 4V2C16 1.72386 15.7761 1.5 15.5 1.5H2.5ZM1 5C1 4.44772 1.44772 4 2 4H16C16.5523 4 17 4.44772 17 5V15C17 15.5523 16.5523 16 16 16H2C1.44772 16 1 15.5523 1 15V5ZM3 6V14H15V6H3Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5ZM8.5 7C7.94772 7 7.5 7.44772 7.5 8C7.5 8.55228 7.94772 9 8.5 9C9.05228 9 9.5 8.55228 9.5 8C9.5 7.44772 9.05228 7 8.5 7Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6 11C6 10.7239 6.22386 10.5 6.5 10.5H12.5C12.7761 10.5 13 10.7239 13 11C13 11.2761 12.7761 11.5 12.5 11.5H6.5C6.22386 11.5 6 11.2761 6 11Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6.5 12.5C6.5 12.2239 6.72386 12 7 12H11C11.2761 12 11.5 12.2239 11.5 12.5C11.5 12.7761 11.2761 13 11 13H7C6.72386 13 6.5 12.7761 6.5 12.5Z"
                              fill="currentColor"
                            />
                          </svg>

                          Restaurants
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {/* Sample path for the dropdown icon */}
                            <path
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill="#000000"
                            />
                          </svg>
                        </NavLink>
                        {/* Dropdown Menu */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                            <li>
                              <NavLink
                                to="/adminrestaurants"
                                className="group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-orange-400"
                                activeClassName="text-white"
                              >
                                <svg
                                  className="fill-current"
                                  width="18"
                                  height="19"
                                  viewBox="0 0 18 19"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clipPath="url(#clip0_130_9756)">
                                    <path
                                      d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V15.8021C0.506348 16.7584 1.29385 17.574 2.27822 17.574H15.7782C16.7345 17.574 17.5501 16.7865 17.5501 15.8021V2.3021C17.522 1.34585 16.7063 0.55835 15.7501 0.55835ZM6.69385 10.599V6.4646H11.3063V10.5709H6.69385V10.599ZM11.3063 11.8646V16.3083H6.69385V11.8646H11.3063ZM1.77197 6.4646H5.45635V10.5709H1.77197V6.4646ZM12.572 6.4646H16.2563V10.5709H12.572V6.4646ZM2.2501 1.82397H15.7501C16.0313 1.82397 16.2563 2.04897 16.2563 2.33022V5.2271H1.77197V2.3021C1.77197 2.02085 1.96885 1.82397 2.2501 1.82397ZM1.77197 15.8021V11.8646H5.45635V16.3083H2.2501C1.96885 16.3083 1.77197 16.0834 1.77197 15.8021ZM15.7501 16.3083H12.572V11.8646H16.2563V15.8021C16.2563 16.0834 16.0313 16.3083 15.7501 16.3083Z"
                                      fill=""
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_130_9756">
                                      <rect
                                        width="18"
                                        height="18"
                                        fill="white"
                                        transform="translate(0 0.052124)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                                Restaurants List
                              </NavLink>

                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}



              <li>


              </li>
              {userType === 'Vendor' && (
                <ul>
                  <li>
                    <NavLink
                      to="/chat"
                      className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      {/* SVG Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 200 100"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="10"
                          width="180"
                          height="80"
                          rx="10"
                          ry="10"
                          fill="#e0e0e0"
                          stroke="#b0bec5"
                          stroke-width="2"
                        />
                        <polygon
                          points="50,80 50,100 70,80"
                          fill="#e0e0e0"
                          stroke="#b0bec5"
                          stroke-width="2"
                        />
                        <circle cx="40" cy="40" r="8" fill="#f66711" />
                        <circle cx="80" cy="40" r="8" fill="#f66711" />
                        <circle cx="120" cy="40" r="8" fill="#f66711" />
                        <circle cx="160" cy="40" r="8" fill="#f66711" />
                        <text
                          x="50%"
                          y="50%"
                          text-anchor="middle"
                          dy=".3em"
                          font-family="Arial, sans-serif"
                          font-size="14"
                          fill="#000"
                        >
                          Chat
                        </text>
                      </svg>
                      Chat
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/coupons"
                      className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      {/* SVG Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 200 100"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="10"
                          width="180"
                          height="80"
                          rx="10"
                          ry="10"
                          fill="#a5a395"
                          stroke="#fbc02d"
                          stroke-width="2"
                        />
                        <line
                          x1="10"
                          y1="40"
                          x2="190"
                          y2="40"
                          stroke="#fbc02d"
                          stroke-width="2"
                        />
                        <circle cx="30" cy="50" r="10" fill="#fbc02d" />
                        <circle cx="170" cy="50" r="10" fill="#fbc02d" />
                        <text
                          x="50%"
                          y="50%"
                          text-anchor="middle"
                          dy=".3em"
                          font-family="Arial, sans-serif"
                          font-size="16"
                          fill="#000"
                        >
                          20% OFF
                        </text>
                        <text
                          x="50%"
                          y="70%"
                          text-anchor="middle"
                          font-family="Arial, sans-serif"
                          font-size="12"
                          fill="#000"
                        >
                          USE CODE: SAVE20
                        </text>
                      </svg>
                      Coupons
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/QrCode"
                      className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      {/* SVG Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="10"
                          width="180"
                          height="180"
                          rx="15"
                          ry="15"
                          fill="#f5f5f5"
                          stroke="#cccccc"
                          stroke-width="2"
                        />
                        <rect x="30" y="30" width="40" height="40" fill="#000" />
                        <rect x="30" y="120" width="40" height="40" fill="#000" />
                        <rect x="120" y="30" width="40" height="40" fill="#000" />
                        <rect x="120" y="120" width="40" height="40" fill="#000" />
                        <rect x="85" y="85" width="30" height="30" fill="#000" />
                        <rect x="140" y="85" width="20" height="20" fill="#000" />
                        <rect x="85" y="140" width="20" height="20" fill="#000" />
                        <text
                          x="50%"
                          y="70%"
                          text-anchor="middle"
                          dy=".3em"
                          font-family="Arial, sans-serif"
                          font-size="14"
                          fill="#000"
                        >
                          QR Code
                        </text>
                      </svg>
                      Qr Code Generator
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/stock"
                      className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' || pathname.includes('dashboard')) && 'bg-graydark dark:bg-meta-4'}`}
                    >
                      {/* SVG Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 400 300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                      >
                        <rect
                          x="10"
                          y="10"
                          width="380"
                          height="280"
                          fill="#c4c4c4"
                          stroke="#cccccc"
                          stroke-width="2"
                        />
                        <line x1="50" y1="250" x2="350" y2="250" stroke="#000" stroke-width="1" />
                        <line x1="50" y1="50" x2="50" y2="250" stroke="#000" stroke-width="1" />
                        <polyline
                          points="50,200 100,150 150,180 200,120 250,160 300,100 350,140"
                          fill="none"
                          stroke="#4caf50"
                          stroke-width="2"
                        />
                        <circle cx="50" cy="200" r="4" fill="#4caf50" />
                        <circle cx="100" cy="150" r="4" fill="#4caf50" />
                        <circle cx="150" cy="180" r="4" fill="#4caf50" />
                        <circle cx="200" cy="120" r="4" fill="#4caf50" />
                        <circle cx="250" cy="160" r="4" fill="#4caf50" />
                        <circle cx="300" cy="100" r="4" fill="#4caf50" />
                        <circle cx="350" cy="140" r="4" fill="#4caf50" />
                        <text
                          x="30"
                          y="200"
                          text-anchor="end"
                          font-family="Arial, sans-serif"
                          font-size="12"
                          fill="#000"
                        >
                          50
                        </text>
                        <text
                          x="30"
                          y="150"
                          text-anchor="end"
                          font-family="Arial, sans-serif"
                          font-size="12"
                          fill="#000"
                        >
                          100
                        </text>
                        <text
                          x="30"
                          y="100"
                          text-anchor="end"
                          font-family="Arial, sans-serif"
                          font-size="12"
                          fill="#000"
                        >
                          150
                        </text>
                        <text
                          x="30"
                          y="50"
                          text-anchor="end"
                          font-family="Arial, sans-serif"
                          font-size="12"
                          fill="#000"
                        >
                          200
                        </text>
                        <text
                          x="50"
                          y="270"
                          text-anchor="middle"
                          font-family="Arial, sans-serif"
                          font-size="14"
                          fill="#000"
                        >
                          Stock
                        </text>
                      </svg>
                      Stock Management
                    </NavLink>
                  </li>
                </ul>
              )}

              <li>
                <NavLink
                  to="/settings"
                  className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/dashboards' ||
                    pathname.includes('dashboard')) &&
                    'bg-graydark dark:bg-meta-4'
                    }`}

                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0-6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM5.707 6.707a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 0-1.414zM18.293 18.293a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0zM6.707 18.293a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 1.414l-.707.707zM18.293 6.707a1 1 0 0 1 1.414 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>

                  Settings
                </NavLink>
              </li>
              {/* <!-- Menu Item Settings --> */}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              OTHERS
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Chart --> */}
              {/* <li>
                <NavLink
                  to="/chart"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-graydarkduration-300 ease-in-out over:bg-orange-400 dark:hover:bg-meta-4 ${pathname.includes('chart') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_130_9801)">
                      <path
                        d="M10.8563 0.55835C10.5188 0.55835 10.2095 0.8396 10.2095 1.20522V6.83022C10.2095 7.16773 10.4907 7.4771 10.8563 7.4771H16.8751C17.0438 7.4771 17.2126 7.39272 17.3251 7.28022C17.4376 7.1396 17.4938 6.97085 17.4938 6.8021C17.2688 3.28647 14.3438 0.55835 10.8563 0.55835ZM11.4751 6.15522V1.8521C13.8095 2.13335 15.6938 3.8771 16.1438 6.18335H11.4751V6.15522Z"
                        fill=""
                      />
                      <path
                        d="M15.3845 8.7427H9.1126V2.69582C9.1126 2.35832 8.83135 2.07707 8.49385 2.07707C8.40947 2.07707 8.3251 2.07707 8.24072 2.07707C3.96572 2.04895 0.506348 5.53645 0.506348 9.81145C0.506348 14.0864 3.99385 17.5739 8.26885 17.5739C12.5438 17.5739 16.0313 14.0864 16.0313 9.81145C16.0313 9.6427 16.0313 9.47395 16.0032 9.33332C16.0032 8.99582 15.722 8.7427 15.3845 8.7427ZM8.26885 16.3083C4.66885 16.3083 1.77197 13.4114 1.77197 9.81145C1.77197 6.3802 4.47197 3.53957 7.8751 3.3427V9.36145C7.8751 9.69895 8.15635 10.0083 8.52197 10.0083H14.7938C14.6813 13.4958 11.7845 16.3083 8.26885 16.3083Z"
                        fill=""
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_130_9801">
                        <rect
                          width="18"
                          height="18"
                          fill="white"
                          transform="translate(0 0.052124)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  Chart
                </NavLink>
              </li> */}
              {/* <!-- Menu Item Chart --> */}

              {/* <!-- Menu Item Ui Elements --> */}
              {/* <SidebarLinkGroup
                activeCondition={pathname === '/ui' || pathname.includes('ui')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-full px-4 py-2 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/ui' || pathname.includes('ui')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9807)">
                            <path
                              d="M15.7501 0.55835H2.2501C1.29385 0.55835 0.506348 1.34585 0.506348 2.3021V7.53335C0.506348 8.4896 1.29385 9.2771 2.2501 9.2771H15.7501C16.7063 9.2771 17.4938 8.4896 17.4938 7.53335V2.3021C17.4938 1.34585 16.7063 0.55835 15.7501 0.55835ZM16.2563 7.53335C16.2563 7.8146 16.0313 8.0396 15.7501 8.0396H2.2501C1.96885 8.0396 1.74385 7.8146 1.74385 7.53335V2.3021C1.74385 2.02085 1.96885 1.79585 2.2501 1.79585H15.7501C16.0313 1.79585 16.2563 2.02085 16.2563 2.3021V7.53335Z"
                              fill=""
                            />
                            <path
                              d="M6.13135 10.9646H2.2501C1.29385 10.9646 0.506348 11.7521 0.506348 12.7083V15.8021C0.506348 16.7583 1.29385 17.5458 2.2501 17.5458H6.13135C7.0876 17.5458 7.8751 16.7583 7.8751 15.8021V12.7083C7.90322 11.7521 7.11572 10.9646 6.13135 10.9646ZM6.6376 15.8021C6.6376 16.0833 6.4126 16.3083 6.13135 16.3083H2.2501C1.96885 16.3083 1.74385 16.0833 1.74385 15.8021V12.7083C1.74385 12.4271 1.96885 12.2021 2.2501 12.2021H6.13135C6.4126 12.2021 6.6376 12.4271 6.6376 12.7083V15.8021Z"
                              fill=""
                            />
                            <path
                              d="M15.75 10.9646H11.8688C10.9125 10.9646 10.125 11.7521 10.125 12.7083V15.8021C10.125 16.7583 10.9125 17.5458 11.8688 17.5458H15.75C16.7063 17.5458 17.4938 16.7583 17.4938 15.8021V12.7083C17.4938 11.7521 16.7063 10.9646 15.75 10.9646ZM16.2562 15.8021C16.2562 16.0833 16.0312 16.3083 15.75 16.3083H11.8688C11.5875 16.3083 11.3625 16.0833 11.3625 15.8021V12.7083C11.3625 12.4271 11.5875 12.2021 11.8688 12.2021H15.75C16.0312 12.2021 16.2562 12.4271 16.2562 12.7083V15.8021Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9807">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        UI Elements
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink> */}
                      {/* <!-- Dropdown Menu Start --> */}
                      {/* <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/ui/alerts"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Alerts
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/ui/buttons"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Buttons
                            </NavLink>
                          </li>
                        </ul>
                      </div> */}
                      {/* <!-- Dropdown Menu End --> */}
                    {/* </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* <!-- Menu Item Ui Elements --> */}

              {/* <!-- Menu Item Auth Pages --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/auth' || pathname.includes('auth')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-full py-2 px-4 font-medium text-graydarkduration-300 ease-in-out hover:bg-orange-300 dark:hover:bg-meta-4 ${(pathname === '/auth' || pathname.includes('auth')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_130_9814)">
                            <path
                              d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
                              fill=""
                            />
                            <path
                              d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
                              fill=""
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_130_9814">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0 0.052124)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        Authentication
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/auth/signin"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Sign In
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/auth/signup"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-full px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white')
                              }
                            >
                              Sign Up
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
