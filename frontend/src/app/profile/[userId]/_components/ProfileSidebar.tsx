'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Layers, Settings, LogOut } from 'lucide-react';
import { logout } from '@/src/api/auth/auth.api';
import { browserClient } from '@/src/lib/api/browser.client';
import React from 'react';

interface ProfileSidebarProps {
    userId: string;
    isOwner: boolean;
}

export default function ProfileSidebar({
    userId,
    isOwner,
}: ProfileSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout(browserClient);
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const navItems = [
        {
            name: 'Overview',
            href: `/profile/${userId}`,
            icon: <User className="w-5 h-5" />,
            show: true,
        },
        {
            name: 'My Stack',
            href: `/profile/${userId}/stack`,
            icon: <Layers className="w-5 h-5" />,
            show: true,
        },
        {
            name: 'Settings',
            href: `/profile/${userId}/settings`,
            icon: <Settings className="w-5 h-5" />,
            show: isOwner,
        },
    ];

    return (
        <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1.5">
                {navItems.map((item) => {
                    if (!item.show) return null;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group ${
                                isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                                    : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground'
                            }`}
                        >
                            <span
                                className={`${isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 group-hover:text-foreground'}`}
                            >
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}

                {isOwner && (
                    <>
                        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium w-full text-left group"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </>
                )}
            </nav>
        </aside>
    );
}
