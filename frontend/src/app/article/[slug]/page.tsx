import { createServerClient } from '@/src/lib/api/server.client';
import { getSoftwareBySlug } from '@/src/api/software/software.api';
import { me } from '@/src/api/auth/auth.api';
import { hasUserUsedSoftware } from '@/src/api/users/users.api';
import { HTTPError } from 'ky';
import Image from 'next/image';
import Link from 'next/link';
import CategoryTags from '@/src/components/CategoryTags';
import ScreenshotGallery from './_components/ScreenshotGallery';
import Markdown from '../../../components/Markdown';
import ProsAndCons from './_components/ProsAndCons';
import SoftwareAlternatives from './_components/SoftwareAlternatives';
import UseSoftwareButton from './_components/UseSoftwareButton';
import { notFound } from 'next/navigation';
import { GlobeIcon, Users } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const slugObject = await params;
    const client = await createServerClient();
    const url = new URL(
        `/article/${slugObject.slug}`,
        process.env.NEXT_PUBLIC_APP_URL || 'https://betterstack.tech',
    );
    try {
        const software = await getSoftwareBySlug(client, slugObject.slug);

        return {
            title: `${software.name} | betterstack`,
            description:
                software.shortDescription ||
                `View details and features of ${software.name}.`,
            openGraph: {
                title: `${software.name} | betterstack`,
                description:
                    software.shortDescription ||
                    `View details and features of ${software.name}.`,
                url: url,
            },
        };
    } catch {
        return {
            title: 'Software Not Found | betterstack',
            description: 'The requested software could not be found.',
        };
    }
}

export default async function SoftwareArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slugObject = await params;
    const client = await createServerClient();

    let software;
    try {
        software = await getSoftwareBySlug(client, slugObject.slug);
        console.log('[ARTICLE PAGE] ✅ Software loaded:', {
            name: software.name,
            slug: software.slug,
            authorId: software.author?.id,
            authorFullName: software.author?.fullName,
            authorBio: software.author?.bio,
            authorAvatarUrl: software.author?.avatarUrl,
        });
    } catch (err) {
        if (err instanceof HTTPError && err.response.status === 404) notFound();
        throw err;
    }

    let isAuthenticated = false;
    let isUsedByCurrentUser = false;

    try {
        await me(client);
        isAuthenticated = true;
    } catch {
        isAuthenticated = false;
    }

    if (isAuthenticated) {
        try {
            const { isUsed } = await hasUserUsedSoftware(client, software.id);
            isUsedByCurrentUser = isUsed;
        } catch {
            isUsedByCurrentUser = false;
        }
    }

    const categoryNames = software.categories.map((c) => c.name);

    return (
        <article className="max-w-4xl mx-auto px-4 py-6 sm:p-6 md:py-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 mb-8">
                <div className="flex items-center gap-4 sm:gap-6">
                    {software.logoUrl && (
                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 overflow-hidden shrink-0">
                            <Image
                                src={software.logoUrl}
                                alt={software.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                                {software.name}
                            </h1>
                            {/* Usage Count Badge */}
                            <div
                                className="hidden sm:flex items-center gap-1.5 shrink-0 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-400"
                                title={`${software.usageCount} users use this`}
                            >
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                    {software.usageCount}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-1">
                            {software.developer && (
                                <p className="text-sm sm:text-lg text-zinc-400">
                                    Developer: {software.developer}
                                </p>
                            )}
                            {/* Usage Count Badge for Mobile (appears below name on small screens) */}
                            <div
                                className="flex sm:hidden items-center gap-1.5 shrink-0 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400"
                                title={`${software.usageCount} users use this`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold">
                                    {software.usageCount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icons & Actions*/}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                    {software.gitRepoUrl && (
                        <Link
                            href={software.gitRepoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300 shrink-0"
                        >
                            <Image
                                src="/github-logo.svg"
                                alt="GitHub"
                                width={24}
                                height={24}
                                className="w-5 h-5 sm:w-6 sm:h-6 object-contain opacity-90"
                            />
                        </Link>
                    )}
                    {software.websiteUrl && (
                        <Link
                            href={software.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 transition-all duration-300 shrink-0"
                        >
                            <GlobeIcon
                                className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-300"
                                strokeWidth={1.5}
                            />
                        </Link>
                    )}

                    {isAuthenticated && (
                        <UseSoftwareButton
                            softwareId={software.id}
                            initialIsUsed={isUsedByCurrentUser}
                        />
                    )}
                </div>
            </header>

            <section className="mb-8 sm:mb-10">
                <h3 className="text-sm sm:text-md font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Categories
                </h3>
                <div>
                    {categoryNames.length === 0 && (
                        <p className="text-base sm:text-lg font-medium">
                            No categories
                        </p>
                    )}
                    <CategoryTags categories={categoryNames} showAll={true} />
                </div>
            </section>

            <section className="mb-8 sm:mb-12">
                {software.shortDescription || software.fullDescription ? (
                    <>
                        <h2 className="text-lg sm:text-xl font-semibold mb-3">
                            Description
                        </h2>
                        <p className="text-base sm:text-lg font-medium mb-5">
                            {software.shortDescription}
                        </p>
                        {software.fullDescription && (
                            <div className="max-w-none prose prose-sm sm:prose-base prose-zinc prose-invert">
                                <Markdown content={software.fullDescription} />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2 className="text-lg sm:text-xl font-semibold mb-2">
                            No description
                        </h2>
                        <hr className="my-4 border-zinc-800" />
                    </>
                )}
            </section>

            <div className="mb-8 sm:mb-12">
                <ScreenshotGallery screenshots={software.screenshotUrls} />
            </div>

            <ProsAndCons
                softwareName={software.name}
                factors={software.factors}
            />

            {/* Author Byline */}
            {software.author && (
                <section className="my-8 sm:my-12 p-5 sm:p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
                        Written by
                    </h3>
                    {console.log('[ARTICLE] 🖼️ RENDERING AUTHOR:', {
                        fullName: software.author.fullName,
                        bio: software.author.bio,
                        avatarUrl: software.author.avatarUrl,
                    })}
                    <div className="flex items-center gap-4">
                        {software.author.avatarUrl ? (
                            <Image
                                src={software.author.avatarUrl}
                                alt={software.author.fullName || 'Author'}
                                width={48}
                                height={48}
                                className="rounded-xl object-cover w-12 h-12 border border-zinc-700"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-lg font-bold">
                                {(software.author.fullName ||
                                    '?')[0].toUpperCase()}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                                {software.author.fullName || 'Anonymous'}
                            </p>
                            {software.author.bio && (
                                <p className="text-sm text-zinc-400 line-clamp-1">
                                    {software.author.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <SoftwareAlternatives
                slug={software.slug}
                softwareName={software.name}
            />
        </article>
    );
}
