import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email'); // 'email' for entering email, 'reset' for resetting password

  const navigate = useNavigate();

  const sendResetEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');

      const response = await axios.post('http://localhost:7000/api/my/auth/forgot-password', {
        email: email,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
      });
      setResetToken(response.data.resetToken);
      setStep('reset');
      setError('');
    } catch (err) {
      console.error('Error sending reset email:', err.response.data.message);
      setError(err.response.data.message);
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userToken = localStorage.getItem('userToken');

      await axios.post('http://localhost:7000/api/my/auth/reset-password', {
        email: email,
        token: resetToken,
        newPassword: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
      });
      navigate('/login'); // Redirect to login page after successful password reset
    } catch (err) {
      console.error('Error resetting password:', err.response.data.message);
      setError(err.response.data.message);
    }
  };

  return (
    <div
      style={{
        margin: 'auto',
        maxWidth: '500px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
      }}
    >
      <h1 style={{ color: 'orange', textAlign: 'center' }}>
        {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
      </h1>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
        }}
        onSubmit={step === 'email' ? sendResetEmail : resetPassword}
      >
        {step === 'email' && (
          <>
            <label htmlFor='email'>Please provide your email address</label>
            <input
              type='email'
              placeholder='e.g john@doe.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px' }}
            />
            <button
              style={{
                backgroundColor: 'white',
                color: 'orange',
                padding: '10px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Send password reset email
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <label htmlFor='resetToken'>Enter the password reset token</label>
            <input
              type='text'
              placeholder='Enter token'
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              style={{ padding: '8px' }}
            />

            <label htmlFor='newPassword'>Enter your new password</label>
            <input
              type='password'
              placeholder='Enter new password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '8px' }}
            />

            <button
              style={{
                backgroundColor: 'orange',
                color: 'white',
                padding: '10px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Reset Password
            </button>
          </>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;



// "use client"
// import  { useState } from 'react';
// import { useAuth, useSignIn } from '@clerk/clerk-react';
// import {  useNavigate } from 'react-router-dom'; // Import useHistory for routing
// import type { FC } from 'react';  // Use FC (FunctionComponent) instead of NextPage

// const ForgotPasswordPage: FC = () => {
//     const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [code, setCode] = useState('');
//   const [successfulCreation, setSuccessfulCreation] = useState(false);
//   const [secondFactor, setSecondFactor] = useState(false);
//   const [error, setError] = useState('');
 
//   const navigate = useNavigate();  // useNavigate hook from react-router-dom
//   const { isSignedIn } = useAuth();
//   const { isLoaded, signIn, setActive } = useSignIn();
 
//   if (!isLoaded) {
//     return null;
//   }
 
//   // If the user is already signed in,
//   // redirect them to the home page
//   if (isSignedIn) {
//     navigate('/');
//   }
 
//   // Send the password reset code to the user's email
//   async function create(e: any) {
//     e.preventDefault();
//     const email=e.target[0].value;
//     console.log(email,":::")

//     await signIn
//       ?.create({
//         strategy: 'reset_password_email_code',
//         identifier: email,
//       })
//       .then(_ => {
//         setSuccessfulCreation(true);
//         setError('');
//       })
//       .catch(err => {
//         console.error('error', err.errors[0].longMessage);
//         setError(err.errors[0].longMessage);
//       });
//   }
 
//   // Reset the user's password. 
//   // Upon successful reset, the user will be 
//   // signed in and redirected to the home page
//   async function reset(e: any) {
//     e.preventDefault();
//     const password=e.target[0].value;
//     console.log(password,":::")
//     const code=e.target[1].value;
//     console.log(code,":::")

//     await signIn
//       ?.attemptFirstFactor({
//         strategy: 'reset_password_email_code',
//         code,
//         password,
//       })
//       .then(result => {
//         // Check if 2FA is required
//         if (result.status === 'needs_second_factor') {
//           setSecondFactor(true);
//           setError('');
//         } else if (result.status === 'complete') {
//           // Set the active session to 
//           // the newly created session (user is now logged in)
//           setActive({ session: result.createdSessionId });
//           setError('');
//         } else {
//           console.log(result);
//         }
//       })
//       .catch(err => {
//         console.error('error', err.errors[0].longMessage)
//         setError(err.errors[0].longMessage);
//       });
//   }
 
//   return (
//     <div
//       style={{
//         margin: 'auto',
//         maxWidth: '500px',
//         padding: '20px',
//         border: '1px solid #ccc',
//         borderRadius: '8px',
//         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//         backgroundColor: 'white',
//       }}
//     >
//       <h1 style={{ color: 'orange', textAlign: 'center' }}>Forgot Password?</h1>
//       <form
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '1em',
//         }}
//         onSubmit={!successfulCreation ? create : reset}
//       >
//         {!successfulCreation && (
//           <>
//             <label htmlFor='email'>Please provide your email address</label>
//             <input
//               type='email'
//               placeholder='e.g john@doe.com'
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               style={{ padding: '8px' }}
//             />

//             <button
//               style={{
//                 backgroundColor: 'white',
//                 color: 'orange',
//                 padding: '10px',
//                 cursor: 'pointer',
//                 border: 'none',
//                 borderRadius: '5px',
//               }}
//             >
//               Send password reset code
//             </button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//           </>
//         )}

//         {successfulCreation && (
//           <>
//             <label htmlFor='password'>Enter your new password</label>
//             <input
//               type='password'
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               style={{ padding: '8px' }}
//             />

//             <label htmlFor='password'>Enter the password reset code that was sent to your email</label>
//             <input
//               type='text'
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               style={{ padding: '8px' }}
//             />

//             <button
//               style={{
//                 backgroundColor: 'orange',
//                 color: 'white',
//                 padding: '10px',
//                 cursor: 'pointer',
//                 border: 'none',
//                 borderRadius: '5px',
//               }}
//             >
//               Reset
//             </button>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//           </>
//         )}

//         {secondFactor && <p style={{ color: 'red' }}>2FA is required, but this UI does not handle that</p>}
//       </form>
//     </div>
//   );
// };

 
// export default ForgotPasswordPage;