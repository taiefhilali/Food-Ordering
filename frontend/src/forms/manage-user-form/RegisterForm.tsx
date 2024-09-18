import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import '../../assets/css/loginmodal.css'; // Replace with actual path to your CSS file
import Input from '../../components/Inputs/RegisterInput';

interface RegisterFormProps {
  closeModal: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    username: '',
    imageFile: null as File | null,
  });

  const [errors, setErrors] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    username: '',
    imageFile: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userType, setUserType] = useState('');
  const userToken = localStorage.getItem('userToken');
  console.log('User token:', userToken);

  const socket = io('http://localhost:8000', {
    multiplex: false,
    transports: ['websocket', 'polling', 'flashsocket'],
    extraHeaders: {
      Authorization: `Bearer ${userToken}`,
    },
  });
  useEffect(() => {
    // Additional logic can be added here if needed
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'userType') {
      setUserType(value);
    } else if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageFile: file || null,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateImageFile = (file: File | null) => {
    if (!file) return 'Please upload an image.';
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, and GIF are allowed.';
    }

    if (file.size > maxSize) {
      return 'File size exceeds 2MB.';
    }

    return '';
  };

  const validateUsername = (username: string) => {
    if (username.length > 3) {
      return 'Username must be at least 3 characters long.';
    }
    return '';
  };

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();

  //     const { email, firstname, lastname, password, username, imageFile } = formData;

  //     let formIsValid = true;
  //     const errors = {
  //         email: '',
  //         firstname: '',
  //         lastname: '',
  //         password: '',
  //         username: '',
  //         imageFile: '',
  //     };

  //     if (!validateEmail(email)) {
  //         formIsValid = false;
  //         errors.email = 'Invalid email format.';
  //     }

  //     if (!firstname) {
  //         formIsValid = false;
  //         errors.firstname = 'First name is required.';
  //     }

  //     if (!lastname) {
  //         formIsValid = false;
  //         errors.lastname = 'Last name is required.';
  //     }

  //     if (!validatePassword(password)) {
  //         formIsValid = false;
  //         errors.password =
  //             'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.';
  //     }

  //     if (!validateUsername(username)) {
  //         formIsValid = false;
  //         errors.username = 'Username must be at least 3 characters long.';
  //     }

  //     const imageError = validateImageFile(imageFile);
  //     if (imageError) {
  //         formIsValid = false;
  //         errors.imageFile = imageError;
  //     }

  //     setErrors(errors);

  //     if (!formIsValid) {
  //         return;
  //     }

  //     setIsSubmitting(true);

  //     const data = new FormData();
  //     data.append('email', email);
  //     data.append('firstname', firstname);
  //     data.append('lastname', lastname);
  //     data.append('password', password);
  //     data.append('username', username);
  //     data.append('userType', userType); // Add userType to formData
  //     if (imageFile) {
  //         data.append('imageFile', imageFile);
  //     }

  //     const token = localStorage.getItem('userToken');

  //     try {
  //         const response = await axios.post('http://localhost:7000/api/my/user/register', data, {
  //             headers: {
  //                 Authorization: `Bearer ${token}`,
  //                 'Content-Type': 'multipart/form-data',
  //             },
  //         });

  //         if (response.status === 201) {
  //             localStorage.setItem('firstname', firstname);
  //             localStorage.setItem('lastname', lastname);
  //             // Emit WebSocket event
  //             socket.emit('newUserAdded', {
  //                 email,
  //                 firstname,
  //                 lastname,
  //                 username,
  //                 // Add any other relevant data you want to emit
  //             });

  //             // Show success alert with email verification message
  //             Swal.fire({
  //                 icon: 'success',
  //                 title: 'Registration Successful!',
  //                 text: 'Please verify your registration by checking your email.',
  //                 imageUrl: 'https://img.icons8.com/clouds/100/000000/email.png', // Replace with your preferred email icon URL
  //                 imageWidth: 20,
  //                 imageHeight: 20,
  //             }).then(() => {
  //                 closeModal();
  //             });
  //         } else {
  //             throw new Error('Failed to register.');
  //         }
  //     } catch (error) {
  //         console.error('Error registering user:', error);
  //         Swal.fire({
  //             icon: 'error',
  //             title: 'Registration Failed',
  //             text: 'Error registering user. Please try again.',
  //         });
  //     } finally {
  //         setIsSubmitting(false);
  //     }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, firstname, lastname, password, username, imageFile } = formData;

    let formIsValid = true;
    const errors = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      username: '',
      imageFile: '',
    };

    if (!validateEmail(email)) {
      formIsValid = false;
      errors.email = 'Invalid email format.';
    }

    if (!firstname) {
      formIsValid = false;
      errors.firstname = 'First name is required.';
    }

    if (!lastname) {
      formIsValid = false;
      errors.lastname = 'Last name is required.';
    }

    if (!validatePassword(password)) {
      formIsValid = false;
      errors.password =
        'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.';
    }

    if (!validateUsername(username)) {
      formIsValid = false;
      errors.username = 'Username must be at least 3 characters long.';
    }

    const imageError = validateImageFile(imageFile);
    if (imageError) {
      formIsValid = false;
      errors.imageFile = imageError;
    }

    setErrors(errors);

    if (!formIsValid) {
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append('email', email);
    data.append('firstname', firstname);
    data.append('lastname', lastname);
    data.append('password', password);
    data.append('username', username);
    data.append('userType', userType); // Add userType to formData
    if (imageFile) {
      data.append('imageFile', imageFile);
    }


    try {
      const response = await axios.post('http://localhost:7000/api/my/user/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        localStorage.setItem('firstname', firstname);
        localStorage.setItem('lastname', lastname);
        // Emit WebSocket event
        socket.emit('newUserAdded', {
          email,
          firstname,
          lastname,
          username,
          // Add any other relevant data you want to emit
        });

        // Show success alert with email verification message
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please verify your registration by checking your email.',
          imageUrl: 'https://img.icons8.com/clouds/100/000000/email.png', // Replace with your preferred email icon URL
          imageWidth: 20,
          imageHeight: 20,
        }).then(() => {
          closeModal();
        });
      } else {
        throw new Error('Failed to register.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Error registering user. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center max-w-4xl ">
      <div className="mb-6 w-full max-w-4xl flex flex-wrap">
        <div className="w-full md:w-1/2 md:pr-2">
          <Input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          {errors.firstname && (
            <p className="text-red-500 text-xs italic">{errors.firstname}</p>
          )}
        </div>
        <div className="w-full md:w-1/2 md:pl-2">
          <Input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          {errors.lastname && (
            <p className="text-red-500 text-xs italic">{errors.lastname}</p>
          )}
        </div>
      </div>

      <div className="mb-4 w-full max-w-md flex flex-wrap">
        <div className="w-full md:w-1/2 md:pr-2">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        <div className="w-full md:w-1/2 md:pl-2">
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">{errors.username}</p>
          )}
        </div>
      </div>
      <div className="mb-4 w-full max-w-md">
        <Input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="px-15"

          required
        />
        {errors.password && (
          <p className="text-red-500 text-xs italic">{errors.password}</p>
        )}
      </div>
      <div className="mb-4 w-full max-w-md">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
        </label>
        <input
          type="file"
          name="imageFile"
          onChange={handleChange}
          accept="image/*"
          required
        />

        {errors.imageFile && (
          <p className="text-red-500 text-xs italic">{errors.imageFile}</p>
        )}
      </div>

      <div >
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">

        </label>
        <div className="mb-4 w-full max-w-md">

          <div >
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="userType"
                value="Vendor"
                checked={userType === "Vendor"}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Vendor</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <input
                type="radio"
                name="userType"
                value="Admin"
                checked={userType === "Admin"}
                onChange={handleChange}
                className="form-radio"
                required
              />
              <span className="ml-2">Admin</span>
            </label>
          </div>
        </div>

      </div>


      <div className="w-60 max-w-md">
        <button
          type="submit"
          className="bg-slate-500 border-b-meta-7 text-white font-bold py-2 px-3 rounded-full focus:outline-none focus:shadow-outline w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm 
