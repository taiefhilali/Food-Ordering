import { SignIn as ClerkSignIn, WithClerkProp } from '@clerk/clerk-react';
import ForgotPasswordPage from './forgotPassword';
import { SignInProps } from '@clerk/types';
import { JSX } from 'react/jsx-runtime';

const SignIn = (props: JSX.IntrinsicAttributes & Omit<WithClerkProp<SignInProps>, "clerk">) => {
  return (
    <div>
      <ClerkSignIn {...props}>
        <div>
          {/* Your sign-in component */}
          <h1>Sign In</h1>
          {/* Include other sign-in elements */}
        </div>
      </ClerkSignIn>

      <ForgotPasswordPage />
    </div>
  );
};

export default SignIn;
