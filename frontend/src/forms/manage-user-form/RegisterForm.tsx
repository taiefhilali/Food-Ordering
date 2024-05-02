
import React, { useState, ChangeEvent, FormEvent } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const isValidEmail = (email: string): boolean => {
    // Regular expression for basic alidation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const RegistrationForm: React.FC = () => {
    const MySwal = withReactContent(Swal);

    const [formData, setFormData] = useState({
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        imageFile: null as File | null,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { email, firstname, lastname, password, imageFile } = formData;

        // Basic form validation
        if (!email || !firstname || !lastname || !password || !imageFile) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill out all fields.',
            });
            return;
        }

        // Validate email format
        if (!isValidEmail(email)) {
            MySwal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter a valid email address.',
            });
            return;
        }

        try {
            const formDataWithImage = new FormData();
            formDataWithImage.append('email', email);
            formDataWithImage.append('firstname', firstname);
            formDataWithImage.append('lastname', lastname);
            formDataWithImage.append('password', password);
            formDataWithImage.append('imageFile', imageFile!);

            const response = await fetch('http://localhost:7000/api/my/user/register', {
                method: 'POST',
                body: formDataWithImage,
            });

            const data = await response.json();
            console.log(data);

            // Save data to localStorage upon successful registration
            localStorage.setItem('registeredUser', JSON.stringify(formData));

            // Show success message with SweetAlert and redirect to verification page
            MySwal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Please verify your email address.',
                showCancelButton: true,
                
                // confirmButtonText: 'Go to Email Verification',
            }).then((result) => {
                // if (result.isConfirmed) {
                    // Redirect to email verification page
                    window.location.href = '/authetication';
                // }
            });
        } catch (error) {
            console.error('Error registering user:', error);
            // Handle error response
            MySwal.fire({
                icon: 'error',
                title: 'Registration Error',
                text: 'An error occurred while registering. Please try again.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
                        First Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="firstname"
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
                        Last Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="lastname"
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
                        Profile Picture
                    </label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="imageFile"
                        type="file"
                        name="imageFile"
                        onChange={handleChange}
                        accept="image/*"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-orange-300 hover:bg-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </div>
        </form>
    );
};

export default RegistrationForm;

// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const isValidEmail = (email: string): boolean => {
//     // Regular expression for basic email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };
  
// const RegistrationForm: React.FC = () => {
//   const MySwal = withReactContent(Swal);

//   const [formData, setFormData] = useState({
//     email: '',
//     firstname: '',
//     lastname: '',
//     password: '',
//     imageFile: null as File | null,
//   });

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;

//     if (e.target.type === 'file') {
//       const file = (e.target as HTMLInputElement).files?.[0];
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         imageFile: file || null,
//       }));
//     } else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const { email, firstname, lastname, password, imageFile } = formData;

//     // Basic form validation
//     if (!email || !firstname || !lastname || !password || !imageFile) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Validation Error',
//         text: 'Please fill out all fields.',
//       });
//       return;
//     }

//     // Validate email format
//     if (!isValidEmail(email)) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Validation Error',
//         text: 'Please enter a valid email address.',
//       });
//       return;
//     }

//     try {
//       const formDataWithImage = new FormData();
//       formDataWithImage.append('email', email);
//       formDataWithImage.append('firstname', firstname);
//       formDataWithImage.append('lastname', lastname);
//       formDataWithImage.append('password', password);
//       formDataWithImage.append('imageFile', imageFile!);

//       const response = await fetch('http://localhost:7000/api/my/user/register', {
//         method: 'POST',
//         body: formDataWithImage,
//       });

//       const data = await response.json();
//       console.log(data);

//       // Save data to localStorage upon successful registration
//       localStorage.setItem('registeredUser', JSON.stringify(formData));

//       // Show success message with SweetAlert and redirect to verification page
//       MySwal.fire({
//         icon: 'success',
//         title: 'Registration Successful!',
//         text: 'Please verify your email address.',
//         showCancelButton: true,
//         confirmButtonText: 'Go to Email Verification',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           // Redirect to email verification page
//           window.location.href = '/verify-email';
//         }
//       });
//     } catch (error) {
//       console.error('Error registering user:', error);
//       // Handle error response
//       MySwal.fire({
//         icon: 'error',
//         title: 'Registration Error',
//         text: 'An error occurred while registering. Please try again.',
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-lg">
//       <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
//             First Name
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="firstname"
//             type="text"
//             name="firstname"
//             value={formData.firstname}
//             onChange={handleChange}
//             placeholder="First Name"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
//             Last Name
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="lastname"
//             type="text"
//             name="lastname"
//             value={formData.lastname}
//             onChange={handleChange}
//             placeholder="Last Name"
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageFile">
//             Profile Picture
//           </label>
//           <input
//             className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="imageFile"
//             type="file"
//             name="imageFile"
//             onChange={handleChange}
//             accept="image/*"
//             required
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-orange-300 hover:bg-white text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="submit"
//           >
//             Register
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default RegistrationForm;
