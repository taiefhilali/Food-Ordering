import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DefaultLayout from '@/layouts/DefaultLayout';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';


const UserProfile = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    phoneNumber: '',
    email: '',
    username: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('userToken');

      if (!userId || !token) {
        console.error('No userId or token found');
        return;
      }

      try {
        const url = `http://localhost:7000/api/my/user/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateUser = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');

    if (!userId || !token) {
      console.error('No userId or token found');
      return;
    }

    try {
      const url = `http://localhost:7000/api/my/user/update/${userId}`;
      const response = await axios.put(url, {
        phoneNumber: event.target.phoneNumber.value,
        email: event.target.emailAddress.value,
        username: event.target.Username.value,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User updated successfully:', response.data);

      // Update user state if necessary
      // setUser(response.data);

      // After updating user, delete profile picture
      // await deleteProfilePicture();

    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // const deleteProfilePicture = async () => {
  //   const userId = localStorage.getItem('userId');
  //   const token = localStorage.getItem('userToken');

  //   if (!userId || !token) {
  //     console.error('No userId or token found');
  //     return;
  //   }

  //   try {
  //     const url = `http://localhost:7000/api/my/user/deleteProfilePicture/${userId}`;
  //     const response = await axios.delete(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log('Profile picture deleted successfully:', response.data);

  //     // Optionally update user state or perform other actions after deletion

  //   } catch (error) {
  //     console.error('Error deleting profile picture:', error);
  //   }
  // };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        {user && (
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 xl:col-span-3">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Personal Information
                  </h3>
                </div>
                <div className="p-7">
                  <form onSubmit={updateUser}>
                    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="fullName"
                        >
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="fullName"
                            id="fullName"
                            value={`${user.firstname} ${user.lastname}`}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <label
                          className="mb-3 block text-sm font-medium text-black dark:text-white"
                          htmlFor="phoneNumber"
                        >
                          Phone Number
                        </label>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="phoneNumber"
                          id="phoneNumber"
                          placeholder="+216"
                          defaultValue={user.phoneNumber}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="email"
                          name="emailAddress"
                          id="emailAddress"
                          placeholder="devidjond45@gmail.com"
                          defaultValue={user.email}
                        />
                      </div>
                    </div>

                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Username
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="Username"
                        id="Username"
                        placeholder="devidjhon24"
                        value={user.username}
                        readOnly
                      />
                    </div>

                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button"
                        onClick={() => console.log('Cancel clicked')}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-span-5 xl:col-span-2">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                  <h3 className="font-medium text-black dark:text-white">
                    Your Photo
                  </h3>
                </div>
                <div className="p-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img src={user.imageUrl} alt="User" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="text-sm hover:text-primary">
                          Delete
                        </button>
                        <button className="text-sm hover:text-primary">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8C15.5 12.1421 12.1421 15.5 8 15.5ZM8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14ZM8.70711 4.70711C8.31658 4.31658 7.68342 4.31658 7.29289 4.70711L5.29289 6.70711C4.90237 7.09763 4.90237 7.7308 5.29289 8.12132C5.68342 8.51185 6.31658 8.51185 6.70711 8.12132L8 6.82843L9.29289 8.12132C9.68342 8.51185 10.3166 8.51185 10.7071 8.12132C11.0976 7.7308 11.0976 7.09763 10.7071 6.70711L8.70711 4.70711Z"
                            fill="#4A4A4A"
                          />
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-primary">
                        Upload your profile picture
                      </span>
                      <span className="text-xs font-normal text-black dark:text-white">
                        File types supported (PNG,JPG,PNG)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UserProfile;
