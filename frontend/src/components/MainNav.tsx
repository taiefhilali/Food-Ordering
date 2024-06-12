import LoginFormModal from '@/forms/manage-user-form/LoginFormModal';
import { Button } from './ui/button';

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function MainNav() {

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
      setIsModalOpen(false);
    };
    const handleRedirectToAuth = () => {
        navigate('/authentication');
      };
      const openModal = () => {
        setIsModalOpen(true);
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
    <div>
      <Button
        variant="ghost"
        onClick={openModal}
        className="mt-6 border-slate-400 text-white font-semibold py-2 rounded hover:bg-orange-300"
      >
        Login
      </Button>

      {isModalOpen && (
            <LoginFormModal closeModal={closeModal} />
          )}
    </div>
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

