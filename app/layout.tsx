import type { Metadata } from 'next';
import { ClerkLoading, ClerkLoaded, ClerkProvider } from '@clerk/nextjs';
import '@/stylesheets/globals.css';
import Logo from '@/components/ui/features/Logo';

export const metadata: Metadata = {
    title: {
        default: 'Taskivio',
        template: '%s',
    },
    description:
        'Taskivio is an intuitive SaaS platform that simplifies task management for individuals and teams. With customizable workflows, smart reminders, and seamless app integrations, it keeps you organized and on track. Elevate your productivity and focus as you turn every task into a stepping stone toward success!',
    icons: {
        icon: '/icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`antialiased`}>
            <body>
                <ClerkProvider>
                    <ClerkLoading>
                        <div className="flex h-screen items-center justify-center text-2xl">
                            <Logo />
                        </div>
                    </ClerkLoading>
                    <ClerkLoaded>{children}</ClerkLoaded>
                </ClerkProvider>
            </body>
        </html>
    );
}
