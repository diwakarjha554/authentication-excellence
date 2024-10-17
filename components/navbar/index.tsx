import React from 'react';
import { SignOutButton } from '@clerk/nextjs';
import Logo from '../ui/features/Logo';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const Navbar = () => {

    const router = useRouter();

    return (
        <div className="w-full bg-zinc-900 text-white fixed top-0 left-0 right-0 z-50">
            <div className="max-w-[1500px] mx-auto flex items-center justify-between py-5 px-5">
                <Logo />
                <div className='flex items-center gap-5'>
                    <Button
                        variant="secondary"
                        onClick={() => router.push('/create-todo')}
                    >
                        Create
                    </Button>
                    <Button
                        variant="secondary"
                    >
                        <SignOutButton />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
