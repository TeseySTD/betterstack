import ProfileSidebar from './_components/ProfileSidebar';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'My Profile | betterstack',
    description: 'Manage your betterstack account and personal preferences.',
};

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl min-h-[80vh]">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    My Account
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your{' '}
                    <span className="font-medium text-foreground">
                        betterstack
                    </span>{' '}
                    profile and personal preferences.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <ProfileSidebar />

                <section className="flex-1 min-w-0">
                    <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
