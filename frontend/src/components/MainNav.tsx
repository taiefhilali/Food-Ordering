import { Button } from './ui/button';
import { SignInButton, SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import {  useNavigate } from 'react-router-dom';
import Auth from './Authentication/Auth';

export default function MainNav() {
    // const navigate = useNavigate();
    // const { signOut } = useClerk();

    // const handleSignOut = async () => {
     
    //     // Sign out using Clerk
    //     await signOut();

    //     // Redirect after sign out
    //     navigate('/');
    // };

    return ( <><Button variant={'ghost'} className='font-bold hover:text-orange-400 hover:bg-white'>
  <div><SignedOut>
                <SignInButton />

            </SignedOut>
            <SignedIn>
                <UserButton/>
            </SignedIn> </div>
            {/* <SignIn></SignIn> */}
<Auth></Auth>  
 
        </Button>
                       {/* <Link to="/forgot-password">Forgot Your Password ?</Link> */}
</>
    );
}

