'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import {
    Menu,
    X,
    Home,
    BookOpen,
    ArrowLeftRight,
    User,
    LogOut,
    Shield,
    Info,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { me, logout } from '@/src/api/auth/auth.api';
import { browserClient } from '@/src/lib/api/browser.client';
import { set } from 'zod';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    useEffect(() => {
        async function checkAuth() {
            try {
                const user = await me(browserClient);
                setUserId(user.id.toString());
                setIsLoggedIn(true);
                setIsAdmin(user.role === 'admin');
            } catch {
                setUserId(null);
                setIsLoggedIn(false);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await logout(browserClient);
            setUserId(null);
            setIsLoggedIn(false);
            setIsAdmin(false);
            setIsMenuOpen(false);
            router.push('/');
            router.refresh();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <header className="w-full bg-linear-[90deg,#09090b80,#11111480] z-40 border-b border-zinc-800 shadow-lg sticky top-0 backdrop-blur-sm">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="shrink-0 relative z-50">
                        <Link
                            href="/"
                            title="betterstack"
                            className="text-2xl font-bold tracking-wide hover:text-gray-400 transition-colors"
                        >
                            <div className="flex items-center gap-x-4 betterstack-logo">
                                <Logo />
                                <span className="hidden md:block bg-linear-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                                    betterstack
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-x-8">
                        <NavLink href="/catalog">Catalog</NavLink>
                        <NavLink href="/comparison">Comparison</NavLink>

                        {isAdmin && <NavLink href="/admin">Admin</NavLink>}

                        {!isLoading &&
                            (isLoggedIn ? (
                                <>
                                    <NavLink href={`/profile/${userId}`}>
                                        Profile
                                    </NavLink>

                                    <button
                                        onClick={handleLogout}
                                        className="text-base font-medium transition-colors duration-300 hover:text-gray-400 relative group cursor-pointer"
                                    >
                                        Sign Out
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink href="/login">Login</NavLink>
                                    <NavLink href="/register">Sign up</NavLink>
                                </>
                            ))}

                        <NavLink href="/about">About</NavLink>
                    </div>

                    <button
                        className="md:hidden p-1 text-zinc-400 hover:text-zinc-200 transition-colors relative z-50"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </nav>
            </header>

            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-500 ease-in-out ${
                    isMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMenuOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 h-dvh w-70 bg-[#09090b] border-l border-zinc-800 z-60 transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${
                    isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-800/50">
                    <span className="text-lg font-semibold text-zinc-200">
                        Menu
                    </span>
                    <button
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <X size={28} />
                    </button>
                </div>
                <div className="flex flex-col px-4 py-6 gap-y-2 overflow-y-auto">
                    <MobileNavLink
                        href="/"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Home size={22} className="text-zinc-400" />
                        <span>Home</span>
                    </MobileNavLink>

                    <MobileNavLink
                        href="/catalog"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <BookOpen size={22} className="text-zinc-400" />
                        <span>Catalog</span>
                    </MobileNavLink>

                    <MobileNavLink
                        href="/comparison"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <ArrowLeftRight size={22} className="text-zinc-400" />
                        <span>Comparison</span>
                    </MobileNavLink>

                    {isAdmin && (
                        <MobileNavLink
                            href="/admin"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Shield size={22} className="text-zinc-400" />
                            <span>Admin</span>
                        </MobileNavLink>
                    )}

                    {!isLoading &&
                        (isLoggedIn ? (
                            <>
                                <MobileNavLink
                                    href={`/profile/${userId}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={22} className="text-zinc-400" />
                                    <span>Profile</span>
                                </MobileNavLink>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-x-3 text-lg font-medium transition-colors px-3 py-3 rounded-lg text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50 w-full text-left cursor-pointer"
                                >
                                    <LogOut
                                        size={22}
                                        className="text-zinc-400"
                                    />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <MobileNavLink
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={22} className="text-zinc-400" />
                                    <span>Login</span>
                                </MobileNavLink>
                                <MobileNavLink
                                    href="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={22} className="text-zinc-400" />
                                    <span>Sign up</span>
                                </MobileNavLink>
                            </>
                        ))}

                    <MobileNavLink
                        href="/about"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Info size={22} className="text-zinc-400" />
                        <span>About</span>
                    </MobileNavLink>
                </div>
            </div>
        </>
    );
}

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const NavLink = ({ href, children }: NavLinkProps) => (
    <Link
        href={href}
        className="text-base font-medium transition-colors duration-300 hover:text-gray-400 relative group"
    >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
);

const MobileNavLink = ({ href, children, onClick }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-x-3 text-lg font-medium transition-colors px-3 py-3 rounded-lg ${
                isActive
                    ? 'text-white bg-zinc-800/80'
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50'
            }`}
        >
            {children}
        </Link>
    );
};
