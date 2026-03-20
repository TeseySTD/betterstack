import { me } from '@/src/api/auth/auth.api';
import { getUserById } from '@/src/api/users/users.api';
import { createServerClient } from '@/src/lib/api/server.client'; // Використовуємо серверний клієнт
import Image from 'next/image';
import { Mail, Github, Linkedin, Shield, Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProfileOverview({
    params,
}: {
    params: Promise<{ userId: string }>;
}) {
    const userIdObject = await params;
    const targetUserId = parseInt(userIdObject.userId);
    const serverClient = await createServerClient();

    if (isNaN(targetUserId)) {
        notFound();
    }

    const [user, currentUser] = await Promise.all([
        getUserById(serverClient, targetUserId).catch(() => null),
        me(serverClient).catch(() => null),
    ]);

    if (!user) {
        notFound();
    }

    const isOwner = currentUser?.id === user.id;

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

                <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-3">
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

                        {isOwner && (
                            <Link
                                href={`/profile/${user.id}/settings`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium transition-all"
                            >
                                <Settings className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        )}
                    </div>

                    {user.bio ? (
                        <p className="text-zinc-400 text-sm mt-2 leading-relaxed max-w-md">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-zinc-600 text-sm mt-2 italic">
                            No bio yet. {isOwner && 'Add one in Settings.'}
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
                            {isOwner && (
                                <Link
                                    href={`/profile/${user.id}/settings`}
                                    className="text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
                                >
                                    Add them in Settings
                                </Link>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
