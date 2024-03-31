  
    import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
    import { Menu } from 'lucide-react';
    import { Separator } from '@radix-ui/react-separator';
    import { Button } from './ui/button';
    import { SignInButton, SignOutButton, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react'; // Import useClerk hook
    import Dashboard from './Dashboard';
    
    export default function MobileNav() {
        const navigate = useNavigate();
        const clerk = useClerk(); // Use the useClerk hook to get access to the Clerk instance
    
        function handleSignOut(): void | Promise<any> {
            throw new Error('Function not implemented.')
        }
    
<<<<<<< HEAD
        
=======
        useEffect(() => {
            // Check if the user is signed in when the component mounts
            if (clerk.session) {
                // If a session exists, navigate to /dashboard
                navigate('/dashboards');
            }
        }, [clerk, navigate]);
    
>>>>>>> 2873ed88deadcb02478cd3e21ddc449eeb3b584b
        return (
            <Sheet>
                <SheetTrigger>
                    <Menu className='text-yellow-300 00'></Menu>
                </SheetTrigger>
                <SheetContent className='space-y-3'>
                    <SheetTitle>
                        <span>Welcome to JO3ETT</span>
                    </SheetTitle>
                    <Separator>
                        <SheetDescription className='flex'>
                            <Button className='flex-1 font-bold bg-yellow-200'>
                                <SignedOut>
                                    <SignInButton />
                                </SignedOut>
                                <SignedIn>
<<<<<<< HEAD
                                    <SignOutButton  />
=======
                                    <SignOutButton signOutCallback={handleSignOut} />
>>>>>>> 2873ed88deadcb02478cd3e21ddc449eeb3b584b
                                </SignedIn>
                            </Button>
                        </SheetDescription>
                    </Separator>
                </SheetContent>
            </Sheet>
        );
    }
    