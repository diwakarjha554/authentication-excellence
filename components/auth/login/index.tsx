import React from 'react';
import AuthLayout from '../AuthLayout';
import LoginLayout from './LoginLayout';

const LoginPage = () => {
    return (
        <AuthLayout href="/auth/register" title="Register">
            <LoginLayout />
        </AuthLayout>
    );
};

export default LoginPage;
