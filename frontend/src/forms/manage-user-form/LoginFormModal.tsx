import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TERipple } from "tw-elements-react";
import { Button } from '@mui/material';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import Auth from '@/components/Authentication/Auth';

const LoginFormModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const updatedErrors = { email: '', password: '' };

        // Email validation
        if (!email.trim()) {
            updatedErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            updatedErrors.email = 'Invalid email format';
            isValid = false;
        }

        // Password validation
        if (!password.trim()) {
            updatedErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            updatedErrors.password = 'Password must be at least 6 characters';
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
        <>
            {/* <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded hover:bg-yellow-600"
            >
                Login
            </button>

            {showModal && ( */}
            
                <section className="h-screen">
                    <div className="container mx-auto px-4 py-24">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left column with image */}
                            <div>
                                <img
                                    src="https://png.pngtree.com/png-clipart/20220424/original/pngtree-cartoon-taco-happy-png-free-vector-and-png-image_7553493.png"
                                    className="w-full"
                                    alt="Phone image"
                                />
                            </div>

                            {/* Right column with form */}
                            <div>
                                <form>
                                    <div className=" mb-6  flex flex-col space-y-6 items-center">
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={`w-full ${errors.email ? "border-red-500" : ""}`}
                                            style={{ borderRadius: "1.5rem" }} // Adjust input border radius
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}

                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full  ${errors.password ? "border-red-500" : ""}`}
                                            style={{ borderRadius: "1.5rem" }} // Adjust input border radius
                                        />
                                        {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
                                    </div>

                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="block">
                                            <input
                                                className="relative float-left mr-1 mt-1 h-4 w-4 appearance-none border border-gray-300 rounded-sm checked:bg-slate-400 checked:border-transparent focus:outline-none"
                                                type="checkbox"
                                            />
                                            <label className="cursor-pointer">Remember me</label>
                                        </div>
                                        <a
                                            href="#!"
                                            className="text-orange-400 hover:text-primary-600 focus:text-primary-600 active:text-primary-700"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    <TERipple rippleColor="light" className="w-full">
                                        <button
                                            type="button"
                                            onClick={handleLogin}
                                            className="inline-block w-full rounded bg-orange-300 y px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                            style={{ borderRadius: "1.5rem" }} // Adjust button border radius
                                        >
                                            Log in
                                        </button>
                                    </TERipple>
                                </form>

                                <div className="my-6 flex items-center justify-center border-t border-neutral-300">
                                    <p className="mx-4 text-sm font-semibold text-center text-neutral-500">OR</p>
                                </div>

                                {/* Social login buttons */}
                                <TERipple rippleColor="light" className="w-full">
                                    {/* <Button
        type="button"
        className="finline-block w-full rounded bg-orange-300 y px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        style={{ backgroundColor: "#FA822F", borderRadius: "1.5rem" }} // Adjust button border radius and color
      
      >
    
        Continue with Clerk Authentication
      </Button> */}

                                    <Button variant={'text'} className="finline-block w-full rounded bg-orange-300 y px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                                        <div>
                                            <SignedOut >
                                                <SignInButton />

                                            </SignedOut>
                                            <SignedIn>
                                                <UserButton />
                                            </SignedIn> </div>
                                        <Auth></Auth>

                                    </Button>
                                </TERipple>
                            </div>
                        </div>
                    </div>
                </section>
            {/* )} */}
        </>
    );
};

export default LoginFormModal;
