'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { me } from '@/src/api/auth/auth.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { User } from '@/src/api/auth/auth.schemas';
import Image from 'next/image';
import { Mail, Github, Linkedin, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfileOverview() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const u = await me(browserClient);
                setUser(u);
            } catch (error) {
                console.error('[PROFILE] 🔴 Failed to fetch user:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
                {user.avatarUrl ? (
                    <Image
                        src={user.avatarUrl}
                        alt={user.fullName || 'Avatar'}
                        width={96}
                        height={96}
                        className="rounded-2xl object-cover w-24 h-24 border border-zinc-700"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-3xl font-bold">
                        {(user.fullName || user.email)[0].toUpperCase()}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-foreground truncate">
                            {user.fullName || 'No name set'}
                        </h2>
                        {user.role === 'admin' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                                <Shield className="w-3 h-3" />
                                Admin
                            </span>
                        )}
                    </div>

                    {user.bio ? (
                        <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-zinc-600 text-sm mt-2 italic">
                            No bio yet. Add one in Settings.
                        </p>
                    )}
                </div>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Contact Info
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-zinc-500" />
                        <span className="text-zinc-300">{user.email}</span>
                    </div>

                    {user.githubUrl && (
                        <Link
                            href={user.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            <Github className="w-4 h-4 text-zinc-500" />
                            {user.githubUrl}
                        </Link>
                    )}

                    {user.linkedinUrl && (
                        <Link
                            href={user.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            <Linkedin className="w-4 h-4 text-zinc-500" />
                            {user.linkedinUrl}
                        </Link>
                    )}

                    {!user.githubUrl && !user.linkedinUrl && (
                        <p className="text-zinc-600 text-sm italic">
                            No social links added yet.{' '}
                            <Link
                                href="/profile/settings"
                                className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
                            >
                                Add them in Settings
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
