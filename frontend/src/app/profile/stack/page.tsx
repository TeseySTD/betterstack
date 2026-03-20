'use client';

import { useEffect, useState } from 'react';
import { browserClient } from '@/src/lib/api/browser.client';
import { getMyStack } from '@/src/api/users/users.api';
import { markSoftwareAsUnused } from '@/src/api/users/users.api';
import type { SoftwareListItem } from '@/src/api/software/software.schemas';
import SoftwareCard from '@/src/components/SoftwareCard';
import { Layers, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StackPage() {
    const router = useRouter();
    const [stack, setStack] = useState<SoftwareListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchStack() {
            try {
                const items = await getMyStack(browserClient);
                setStack(items);
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        fetchStack();
    }, [router]);

    const handleRemove = async (softwareId: number) => {
        setRemovingId(softwareId);
        try {
            await markSoftwareAsUnused(browserClient, softwareId);
            setStack((prev) => prev.filter((s) => s.id !== softwareId));
        } catch (err) {
            console.error('Failed to remove software:', err);
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    if (stack.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="w-12 h-12 text-zinc-600 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Your stack is empty
                </h2>
                <p className="text-zinc-400 text-sm mb-6 max-w-sm">
                    Browse the catalog and mark software as &quot;used&quot; to
                    build your personal stack.
                </p>
                <Link
                    href="/catalog"
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                    My Stack
                </h2>
                <span className="text-sm text-zinc-500">
                    {stack.length} item{stack.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex flex-wrap gap-5">
                {stack.map((item) => (
                    <div key={item.id} className="relative group/card">
                        <SoftwareCard item={item} />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleRemove(item.id);
                            }}
                            disabled={removingId === item.id}
                            className="absolute top-3 right-3 z-30 opacity-0 group-hover/card:opacity-100 transition-opacity px-2.5 py-1.5 rounded-lg bg-red-500/90 hover:bg-red-500 text-white text-xs font-medium backdrop-blur-sm disabled:opacity-50"
                        >
                            {removingId === item.id ? 'Removing…' : 'Remove'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
