import { Button } from './ui/button';
import { SignInButton, SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import Auth from './Authentication/Auth';
import AuthPage from '@/pages/Authentication/AuthPage';
import LoginFormModal from '@/forms/manage-user-form/LoginFormModal';
import { useNavigate } from 'react-router-dom';

export default function MainNav() {

    const navigate = useNavigate();

    const handleRedirectToAuth = () => {
        navigate('/authentication');
      };

    // const navigate = useNavigate();
    // const { signOut } = useClerk();

    // const handleSignOut = async () => {
     
    //     // Sign out using Clerk
    //     await signOut();

    //     // Redirect after sign out
    //     navigate('/');
    // };

    return ( <>
    <Button
            variant="ghost"
            onClick={handleRedirectToAuth}
            className="mt-6 border-slate-400 text-white font-semibold py-2 rounded hover:bg-orange-300"
          >
            Go to Authentication
          </Button>
    {/* <Button variant={'ghost'} className='font-bold hover:text-orange-400 hover:bg-white'>
  <div><SignedOut>
                <SignInButton />

            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn> </div>
<Auth></Auth>  
 
        </Button> */}
                                {/* <section><LoginFormModal></LoginFormModal></section> */}

      

</>
    );
}

