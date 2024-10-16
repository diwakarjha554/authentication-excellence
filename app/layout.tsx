import type { Metadata } from 'next';
import '@/stylesheets/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
    title: {
        default: 'Authentication',
        template: '%s',
    },
    description: 'This is the authentication webapp',
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
        <html lang="en">
            <body>
                <ClerkProvider>
                    <Navbar />
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}
