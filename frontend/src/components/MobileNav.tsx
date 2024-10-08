  
    import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet';
    import { Menu } from 'lucide-react';
    import { Separator } from '@radix-ui/react-separator';
    import { Button } from './ui/button';
    import { SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react'; // Import useClerk hook
    
    export default function MobileNav() {
        // const navigate = useNavigate();
        // const clerk = useClerk(); // Use the useClerk hook to get access to the Clerk instance
    
        // function handleSignOut(): void | Promise<any> {
        //     throw new Error('Function not implemented.')
        // }
    
        
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
                                    <SignOutButton  />
                                </SignedIn>
                            </Button>
                        </SheetDescription>
                    </Separator>
                </SheetContent>
            </Sheet>
        );
    }
    