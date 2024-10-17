import React from 'react';
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import LoginPage from '@/components/auth/login';

export const metadata: Metadata = {
    title: 'Login | Taskivio',
    description: 'Login to your Taskivio account that simplifies task management for individuals and teams.',
};

const page = () => {
    const { userId } = auth();
    if (userId) {
        redirect('/');
    }
    return <LoginPage />;
};

export default page;
