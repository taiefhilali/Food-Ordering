import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { Button } from './ui/button'

export default function MobileNav() {
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
            <Button className='flex-1 font-bold bg-yellow-200'>
                LogIn
            </Button>
        </SheetDescription>
    </Separator>
</SheetContent>

</Sheet>
    )
}
