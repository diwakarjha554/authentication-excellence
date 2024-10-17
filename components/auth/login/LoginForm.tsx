'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const [isLoading, setIsLoading] = useState(false);
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!isLoaded) {
            setIsLoading(false);
            return;
        }

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                router.push('/'); // Redirect to home page or dashboard
            } else {
                console.error('Login failed', result);
                setError('Login failed. Please check your credentials and try again.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleGoogleLogin = async () => {
        if (!isLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (err) {
            console.error('Error during Google login:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during Google login.');
        }
    };

    return (
        <div className={cn('grid gap-6', className)}>
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Input
                            id="email"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Email Id'
                            required
                        />
                    </div>
                    <div className="grid gap-1">
                        <Input
                            id="password"
                            type="password"
                            autoCapitalize="none"
                            autoComplete="current-password"
                            autoCorrect="off"
                            disabled={isLoading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Password'
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleLogin}>
                {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}
                Google
            </Button>
        </div>
    );
};

export default LoginForm;
