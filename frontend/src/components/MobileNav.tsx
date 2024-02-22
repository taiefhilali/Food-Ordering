import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { Button } from './ui/button'
import { SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react'

export default function MobileNav() {
    function handleSignOut(): void | Promise<any> {
        throw new Error('Function not implemented.')
    }

  return (
<Sheet>
<SheetTrigger>
    <Menu className='text-yellow-300
    00'></Menu>
</SheetTrigger>

<SheetContent className='space-y-3'>
    <SheetTitle>
        <span>Wetcome to JO3ETT</span>
    </SheetTitle>
    <Separator>
        <SheetDescription className='flex'>
            {/* <Button className='flex-1 font-bold bg-yellow-200'>
                LogIn
            </Button> */}
            <Button className='flex-1 font-bold bg-yellow-200'>
                 <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <SignOutButton signOutCallback={handleSignOut} />
            </SignedIn>
            </Button>
           
        </SheetDescription>
    </Separator>
</SheetContent>

</Sheet>
    )
}
