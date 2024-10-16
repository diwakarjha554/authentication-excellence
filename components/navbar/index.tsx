import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className='bg-black text-white w-full h-16 flex justify-center items-center fixed top-0 z-50'>
            <div className='w-full max-w-[1500px] flex justify-between items-center'>
                <Link href='/' className='text-2xl font-bold'>
                    Authentication
                </Link>
                <SignedIn>
                    <div className='flex items-center gap-4'>
                        <UserButton />
                        <div className='cursor-pointer bg-blue-500 p-2 rounded font-semibold'>
                            <SignOutButton />
                        </div>
                    </div>
                </SignedIn>
            </div>
        </div>
    );
};

export default Navbar;
