import React from 'react'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Circle, CircleUserRound, User } from 'lucide-react'
import { useUser } from '@clerk/clerk-react';
import { DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

export default function UserNameMenu() {
    const { user} = useUser();


  return (
    <DropdownMenu>
        <DropdownMenuTrigger className='flex items-center px-3 font-bold hover:text-orange-400 gap-2'>
            <CircleUserRound className='text-white-500'>
             <h1> {user?.firstName}</h1> 
            </CircleUserRound>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem>
            <Link to="/user-profile" className='font-bold  hover:text-orange-50'> User Profile</Link>

            </DropdownMenuItem>
            <Separator/>
            <DropdownMenuItem>
                <Button className='flex flex-1 font-bold bg-orange-500'> LogOut</Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
