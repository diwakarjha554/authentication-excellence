import React from 'react';
import { SignOutButton } from '@clerk/nextjs';
import Logo from '../ui/features/Logo';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className="w-full bg-zinc-900 text-white fixed top-0 left-0 right-0 z-50">
            <div className="max-w-[1500px] mx-auto flex items-center justify-between py-5 px-5">
                <Logo />
                <div className='flex items-center gap-5'>
                    <Link href="/create-todo" className="cursor-pointer bg-blue-500 p-2 rounded">
                        Create
                    </Link>
                    <div className="cursor-pointer bg-blue-500 p-2 rounded">
                        <SignOutButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
