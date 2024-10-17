import React from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import NavbarMarginLayout from '@/components/ui/navbar-margin-layout';

const page = async () => {
    const { userId } = auth();
    if (!userId) {
        redirect('/auth/login');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start min-w-screen overflow-x-hidden relative">
            <NavbarMarginLayout>
                Hello
            </NavbarMarginLayout>
        </main>
    );
};

export default page;
