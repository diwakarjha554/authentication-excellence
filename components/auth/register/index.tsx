import React from 'react';
import AuthLayout from '../AuthLayout';
import RegisterLayout from './RegisterLayout';

const RegisterPage = () => {
    return (
        <AuthLayout href="/auth/login" title="Login">
            <RegisterLayout />
        </AuthLayout>
    );
};

export default RegisterPage;
