'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Layers, Settings, LogOut } from 'lucide-react';
import React from 'react';

export default function ProfileSidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            // Тут основна інфа відображається
            name: 'Overview',
            href: '/profile',
            icon: <User className="w-5 h-5" />,
        },
        {
            // Тут думаю буде список софта який користувач юзає, щось по типу каталога
            name: 'My Stack',
            href: '/profile/stack',
            icon: <Layers className="w-5 h-5" />,
        },
        {
            // Ну тут здається щоьс по типу редагування аккаунта та думаю кнопку видалити аккаунт зробити (якщо логіки нема то роби тільки UI)
            name: 'Settings',
            href: '/profile/settings',
            icon: <Settings className="w-5 h-5" />,
        },
    ];

    return (
        <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium group ${
                                isActive
                                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-50 dark:text-zinc-100'
                                    : 'text-foreground/70 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-foreground'
                            }`}
                        >
                            <span
                                className={`${isActive ? 'text-zinc-50 dark:text-zinc-100' : 'text-zinc-400 group-hover:text-foreground'}`}
                            >
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    );
                })}

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />

                {/* Зроби логіку виходу з акка так же як і в хедері */}
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 dark::text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors font-medium w-full text-left group">
                    <span className="text-zinc-400 dark:text-zinc-100 group-hover:text-foreground transition-colors">
                        <LogOut className="w-5 h-5" />
                    </span>
                    Sign Out
                </button>
            </nav>
        </aside>
    );
}
