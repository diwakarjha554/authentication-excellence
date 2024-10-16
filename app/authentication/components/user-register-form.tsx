'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

// Define a custom error type
type CustomError = {
    errors?: { message: string }[];
    message?: string;
};

interface UserRegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserRegisterForm({ className, ...props }: UserRegisterFormProps) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { isLoaded, signUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function onSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        if (!isLoaded) {
            return;
        }

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            // send the email.
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

            // change the UI to our pending section.
            setPendingVerification(true);
        } catch (err: unknown) {
            console.error(err);
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during registration.'
            );
        }
    }

    // Verify User Email Code
    const onPressVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isLoaded) {
            return;
        }

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
            console.error(JSON.stringify(err, null, 2));
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message ||
                    customError.message ||
                    'An error occurred during email verification.'
            );
        }
    };

    // Google Sign Up
    const handleGoogleSignUp = async () => {
        if (!isLoaded) {
            return;
        }

        try {
            await signUp.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (err: unknown) {
            console.error('Error during Google sign up:', err);
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during Google sign up.'
            );
        }
    };

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            {!pendingVerification && (
                <form onSubmit={onSubmit}>
                    <div className="grid gap-2">
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="first_name">
                                First Name
                            </Label>
                            <Input
                                type="text"
                                name="first_name"
                                id="first_name"
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First name"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                required={true}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="last_name">
                                Last Name
                            </Label>
                            <Input
                                type="text"
                                name="last_name"
                                id="last_name"
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last name"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                required={true}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="email">
                                Email Address
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                required={true}
                            />
                        </div>
                        <div className="grid gap-1">
                            <Label className="sr-only" htmlFor="password">
                                Password
                            </Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect="off"
                                disabled={isLoading}
                                required={true}
                            />
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Register
                        </Button>
                    </div>
                </form>
            )}
            {pendingVerification && (
                <div>
                    <form className="space-y-4 md:space-y-6">
                        <input
                            value={code}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter Verification Code..."
                            onChange={(e) => setCode(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={onPressVerify}
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Verify Email
                        </button>
                    </form>
                </div>
            )}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={handleGoogleSignUp}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center hover:bg-gray-50"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_13183_10121)">
                            <path
                                d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z"
                                fill="#3F83F8"
                            />
                            <path
                                d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z"
                                fill="#FBBC04"
                            />
                            <path
                                d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z"
                                fill="#EA4335"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_13183_10121">
                                <rect width="20" height="20" fill="white" transform="translate(0.5)" />
                            </clipPath>
                        </defs>
                    </svg>
                    Sign up with Google
                </button>
            </div>
        </div>
    );
}