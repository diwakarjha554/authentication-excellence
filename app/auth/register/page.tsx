import React from 'react';
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RegisterPage from '@/components/auth/register';

export const metadata: Metadata = {
    title: 'Register | Taskivio',
    description: 'Create an Taskivio account that simplifies task management for individuals and teams.',
};

const page = () => {
    const { userId } = auth();
    if (userId) {
        redirect('/');
    }
    return <RegisterPage />;
};

export default page;
