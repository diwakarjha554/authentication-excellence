import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sign In | Authentication',
    description: 'Sign in to your account',
};

const SignInPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <SignIn />
        </div>
    );
};

export default SignInPage;
