'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
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

const LoginForm = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
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
            await signIn.create({
                identifier: email,
                strategy: 'email_code',
            });

            setPendingVerification(true);
        } catch (err: unknown) {
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during sign-in.'
            );
        } finally {
            setIsLoading(false);
        }
    }

    const onPressVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isLoaded) return;

        try {
            const completeSignIn = await signIn.attemptFirstFactor({
                strategy: 'email_code',
                code,
            });

            if (completeSignIn.status === 'complete') {
                await setActive({ session: completeSignIn.createdSessionId });
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

    const handleGoogleSignIn = async () => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (err: unknown) {
            const customError = err as CustomError;
            setError(
                customError.errors?.[0]?.message || customError.message || 'An error occurred during Google sign in.'
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
                                id="email"
                                name="email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Id"
                                disabled={isLoading}
                                required
                                className=''
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
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
            <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}
                Sign in with Google
            </Button>
        </div>
    );
};

export default LoginForm;