import ProfileSidebar from './_components/ProfileSidebar';
import { me } from '@/src/api/auth/auth.api';
import { createServerClient } from '@/src/lib/api/server.client';
import React from 'react';

export default async function ProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string }>;
}) {
    const { userId } = await params;
    const serverClient = await createServerClient();

    const currentUser = await me(serverClient).catch(() => null);
    const isOwner = currentUser?.id.toString() === userId;

    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl min-h-[80vh]">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {isOwner ? 'My Account' : 'User Profile'}
                </h1>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <ProfileSidebar userId={userId} isOwner={isOwner} />

                <section className="flex-1 min-w-0">
                    <div className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}
