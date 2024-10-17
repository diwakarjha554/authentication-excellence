'use client';

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

type CustomError = {
    errors?: { message: string }[];
    message?: string;
};

const RegisterForm = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!isLoaded) {
            setIsLoading(false);
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: unknown) {
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during registration.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    const onPressVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });
            if (completeSignUp.status !== 'complete') {
                console.log(JSON.stringify(completeSignUp, null, 2));
            }
            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push('/');
            }
        } catch (err: unknown) {
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message ||
                    customError.message ||
                    'An error occurred during email verification.'
            );
        }
    };

    const handleGoogleSignUp = async () => {
        if (!isLoaded) return;

        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (err: unknown) {
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during Google sign up.'
            );
        }
    };

    return (
        <div className={cn('grid gap-6', className)}>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {!pendingVerification ? (
                <form onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Input
                                id="first_name"
                                name="first_name"
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-1">
                            <Input
                                id="last_name"
                                name="last_name"
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-1">
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Id"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-1">
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                        </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="grid gap-2">
                        <Input
                            id="code"
                            name="code"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <Button type="button" onClick={onPressVerify}>
                            Verify Email
                        </Button>
                    </div>
                </form>
            )}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" onClick={handleGoogleSignUp} disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <svg
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="google"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 488 512"
                    >
                        <path
                            fill="currentColor"
                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                        ></path>
                    </svg>
                )}
                Sign up with Google
            </Button>
        </div>
    );
};

export default RegisterForm;
