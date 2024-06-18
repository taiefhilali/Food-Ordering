import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

interface RegisterFormProps {
  closeModal: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    imageFile: null as File | null,
  });

  const [errors, setErrors] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    imageFile: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (e.target.type === 'file') {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const { email, firstname, lastname, password, imageFile } = formData;
  
    // Validation
    let formIsValid = true;
    const errors = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
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
      errors.password = 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one number.';
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
  
    // Create FormData object to send as multipart/form-data
    const data = new FormData();
    data.append('email', email);
    data.append('firstname', firstname);
    data.append('lastname', lastname);
    data.append('password', password);
    if (imageFile) {
      data.append('imageFile', imageFile);
    } else {
      data.append('imageFile', ''); // or handle the error
    }
  
    try {
      const response = await axios.post('http://localhost:7000/api/my/user/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You have successfully registered.',
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
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full px-4 py-2 border rounded"
          required
        />
        {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
          First Name
        </label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          className="block w-full px-4 py-2 border rounded"
          required
        />
        {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
          Last Name
        </label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          className="block w-full px-4 py-2 border rounded"
          required
        />
        {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="block w-full px-4 py-2 border rounded"
          required
        />
        {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
          Profile Image
        </label>
        <input
          type="file"
          name="imageFile"
          onChange={handleChange}
          accept="image/*"
          className="block w-full px-4 py-2 border rounded"
          required
        />
        {errors.imageFile && <p className="text-red-500 text-xs italic">{errors.imageFile}</p>}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
