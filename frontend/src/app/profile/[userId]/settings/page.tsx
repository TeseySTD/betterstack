'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { me, logout } from '@/src/api/auth/auth.api';
import { updateProfile } from '@/src/api/users/users.api';
import { browserClient } from '@/src/lib/api/browser.client';
import type { User } from '@/src/api/auth/auth.schemas';
import { Save, Loader2, Trash2 } from 'lucide-react';
import { HTTPError } from 'ky';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');

    useEffect(() => {
        async function fetchUser() {
            try {
                const u = await me(browserClient);
                setUser(u);
                setFullName(u.fullName || '');
                setBio(u.bio || '');
                setAvatarUrl(u.avatarUrl || '');
                setGithubUrl(u.githubUrl || '');
                setLinkedinUrl(u.linkedinUrl || '');
            } catch (error: unknown) {
                if (error instanceof HTTPError) {
                    if (error.response.status === 401) {
                        router.push('/login');
                    }
                } else if (error instanceof Error) {
                    console.error('Error:', error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const input: Record<string, string> = {};

            // Only include fields that have values
            if (fullName.trim()) input.fullName = fullName.trim();
            if (bio.trim()) input.bio = bio.trim();
            if (avatarUrl.trim()) input.avatarUrl = avatarUrl.trim();
            if (githubUrl.trim()) input.githubUrl = githubUrl.trim();
            if (linkedinUrl.trim()) input.linkedinUrl = linkedinUrl.trim();

            const updated = await updateProfile(browserClient, input);
            setUser(updated);
            setMessage({
                type: 'success',
                text: 'Profile updated successfully!',
            });
            setTimeout(() => {
                router.push('/profile');
            }, 1000);
        } catch (error) {
            console.error('[SETTINGS] 🔴 Update failed:', error);
            setMessage({
                type: 'error',
                text: 'Failed to update profile. Please check your inputs.',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        // Sign out the user since delete is not implemented on the backend
        try {
            await logout(browserClient);
            router.push('/');
            router.refresh();
        } catch {
            setMessage({ type: 'error', text: 'Something went wrong.' });
        }
    };

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
            <h2 className="text-xl font-semibold text-foreground">
                Edit Profile
            </h2>

            {message && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm font-medium ${
                        message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        maxLength={100}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={500}
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                    />
                    <p className="text-xs text-zinc-600 mt-1">
                        {bio.length}/500
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        Avatar URL
                    </label>
                    <input
                        type="url"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        GitHub URL
                    </label>
                    <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                        LinkedIn URL
                    </label>
                    <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-white transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </button>
            </form>

            <div className="h-px bg-zinc-800" />

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">
                    Danger Zone
                </h3>
                <p className="text-sm text-zinc-500">
                    Deleting your account is permanent and cannot be undone.
                </p>

                {!showDeleteConfirm ? (
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                    </button>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            Confirm Delete
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
