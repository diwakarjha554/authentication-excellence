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

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, href, title}) => {
    return (
        <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <Link
                href={href}
                className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
            >
                {title}
            </Link>
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
                    <Image src="/images/logo_taskivio.png" alt="Taskivio" width={100000000} height={100000000} className='w-[170px]' priority/>
                </Link>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;This library has saved me countless hours of work and helped me deliver stunning
                            designs to my clients faster than ever before.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">{children}</div>
        </div>
    );
};

export default AuthLayout;
