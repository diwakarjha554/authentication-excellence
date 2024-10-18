import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Image from 'next/image';

interface AuthLayoutProps {
    children: React.ReactNode;
    href: string;
    title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, href, title }) => {
    return (
        <div className="flex items-center justify-center px-5 lg:px-0">
            <div className="container relative h-screen flex flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href={href}
                    className={cn(
                        buttonVariants({ variant: 'secondary' }),
                        'absolute right-4 top-4 md:right-8 md:top-8 '
                    )}
                >
                    {title}
                </Link>
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
                        <Image
                            src="/images/logo_taskivio.png"
                            alt="Taskivio"
                            width={100000000}
                            height={100000000}
                            className="w-[170px]"
                            priority
                        />
                    </Link>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Transform your to-do list into a roadmap to success; each task completed is a
                                victory, paving the way for your dreams to unfold.&rdquo;
                            </p>
                            <p className="text-end">
                                -{' '}
                                <Link
                                    href="https://diwakarjha.vercel.app/"
                                    target="_blank"
                                    className="text-[#8d71ff] pr-1 hover:underline"
                                >
                                    Diwakar Jha
                                </Link>
                            </p>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
