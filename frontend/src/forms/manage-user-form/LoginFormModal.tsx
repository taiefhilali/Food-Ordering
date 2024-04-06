import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TEInput, TERipple } from "tw-elements-react";

const LoginFormModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate(); // Hook for navigation

  const validateForm = () => {
    let isValid = true;
    const updatedErrors = { email: '', password: '' };

    if (!email) {
      updatedErrors.email = 'Email is required';
      isValid = false;
    }

    if (!password) {
      updatedErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(updatedErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:7000/api/my/user/login', {
        email,
        password,
      });

      console.log('User logged in successfully:', response.data);

      localStorage.setItem('loggedInUser', JSON.stringify({ email }));

      setShowModal(false);
      navigate('/dashboards');

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome! You are now logged in.',
      });

    } catch (error) {
      console.log('Error logging in');

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    // <>
    //   <button
    //     onClick={() => setShowModal(true)}
    //     className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600"
    //   >
    //     Login
    //   </button>

    //   {showModal && (
    <section className="h-screen">
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left column with image */}
        <div>
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full"
            alt="Phone image"
          />
        </div>

        {/* Right column with form */}
        <div>
          <form>
            <TEInput
              type="email"
              label="Email address"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mb-6 ${errors.email ? "border-red-500" : ""}`}
              style={{ borderRadius: "1.5rem" }} // Adjust input border radius
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

            <TEInput
              type="password"
              label="Password"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mb-6 ${errors.password ? "border-red-500" : ""}`}
              style={{ borderRadius: "1.5rem" }} // Adjust input border radius
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

            <div className="mb-6 flex items-center justify-between">
              <div className="block">
                <input
                  className="relative float-left mr-1 mt-1 h-4 w-4 appearance-none border border-gray-300 rounded-sm checked:bg-primary checked:border-transparent focus:outline-none"
                  type="checkbox"
                />
                <label className="cursor-pointer">Remember me</label>
              </div>
              <a
                href="#!"
                className="text-primary hover:text-primary-600 focus:text-primary-600 active:text-primary-700"
              >
                Forgot password?
              </a>
            </div>

            <TERipple rippleColor="light" className="w-full">
              <button
                type="button"
                onClick={handleLogin}
                className="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                style={{ borderRadius: "1.5rem" }} // Adjust button border radius
              >
                Sign in
              </button>
            </TERipple>
          </form>

          <div className="my-6 flex items-center justify-center border-t border-neutral-300">
            <p className="mx-4 text-sm font-semibold text-center text-neutral-500">OR</p>
          </div>

          {/* Social login buttons */}
          <TERipple rippleColor="light" className="w-full">
            <a
              href="#!"
              className="flex items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              style={{ backgroundColor: "#3b5998", borderRadius: "1.5rem" }} // Adjust button border radius
            >
              {/* Facebook icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Continue with Facebook
            </a>
          </TERipple>
          <TERipple rippleColor="light" className="w-full">
            <a
              href="#!"
              className="flex items-center justify-center rounded bg-info px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
              style={{ backgroundColor: "#55acee", borderRadius: "1.5rem" }} // Adjust button border radius
            >
              {/* Twitter icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-3.5 w-3.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Continue with Twitter
            </a>
          </TERipple>
        </div>
      </div>
    </div>
  </section>
      )}
//     </>
//   );
// };

export default LoginFormModal;
