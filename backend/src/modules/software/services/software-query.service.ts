import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Software } from '../entities/software.entity';
import { SoftwareFactor } from '../entities/software-factor.entity';
import { SoftwareComparisonNote } from '../entities/software-comparison-note.entity';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    SoftwareListItemDto,
    SoftwareDetailDto,
    SoftwareFactorDto,
    SoftwareFactorsDto,
    SoftwareMetricDto,
} from '../dto/software-response.dto';
import {
    SoftwareComparisonDto,
    SoftwareComparisonSideDto,
    MetricComparisonItemDto,
    FactorComparisonItemDto,
} from '../dto/software-comparison.dto';

@Injectable()
export class SoftwareQueryService {
    constructor(
        @InjectRepository(Software)
        private readonly repo: Repository<Software>,
        @InjectRepository(SoftwareComparisonNote)
        private readonly comparisonNoteRepo: Repository<SoftwareComparisonNote>,
    ) {}

    private toListItem(sw: Software): SoftwareListItemDto {
        return {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            logoUrl: sw.logoUrl,
            shortDescription: sw.shortDescription,
            usageCount: sw.usageCount,
            categories: (sw.categories ?? []).map((c) => c.name),
        };
    }

    private toFactorDto(sf: SoftwareFactor): SoftwareFactorDto {
        return { factorId: sf.factorId, factorName: sf.factorName };
    }

    private groupFactors(
        softwareFactors: SoftwareFactor[],
    ): SoftwareFactorsDto {
        return (softwareFactors ?? []).reduce<SoftwareFactorsDto>(
            (acc, sf) => {
                if (sf.isPositive) {
                    acc.positive.push(this.toFactorDto(sf));
                } else {
                    acc.negative.push(this.toFactorDto(sf));
                }
                return acc;
            },
            { positive: [], negative: [] },
        );
    }

    private toComparisonSide(sw: Software): SoftwareComparisonSideDto {
        return {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            developer: sw.developer,
            shortDescription: sw.shortDescription,
            websiteUrl: sw.websiteUrl,
            gitRepoUrl: sw.gitRepoUrl,
            logoUrl: sw.logoUrl,
            screenshotUrls: sw.screenshotUrls,
            usageCount: sw.usageCount,
            createdAt: sw.createdAt,
            updatedAt: sw.updatedAt,
            categories: (sw.categories ?? []).map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
            })),
            factors: this.groupFactors(sw.softwareFactors ?? []),
        };
    }

    async findAll(
        q: string | undefined,
        page: number,
        perPage: number,
        categoryIds?: number[],
    ): Promise<PaginatedResponseDto<SoftwareListItemDto>> {
        const qb = this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .orderBy('software.usageCount', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage);

        if (q) {
            qb.andWhere(
                'software.name ILIKE :q OR software.shortDescription ILIKE :q',
                { q: `%${q}%` },
            );
        }

        if (categoryIds && categoryIds.length > 0) {
            qb.innerJoin(
                'software.categories',
                'filterCat',
                'filterCat.id IN (:...categoryIds)',
                { categoryIds },
            );
        }

        const [items, total] = await qb.getManyAndCount();
        return new PaginatedResponseDto(
            items.map((sw) => this.toListItem(sw)),
            total,
            page,
            perPage,
        );
    }

    async findMostUsed(limit: number): Promise<SoftwareListItemDto[]> {
        const items = await this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .orderBy('software.usageCount', 'DESC')
            .take(limit)
            .getMany();
        return items.map((sw) => this.toListItem(sw));
    }

    async findOneBySlug(slug: string): Promise<SoftwareDetailDto> {
        const sw = await this.repo.findOne({
            where: { slug },
            relations: [
                'categories',
                'softwareFactors',
                'softwareMetrics',
                'softwareMetrics.metric',
                'author',
            ],
        });

        if (sw?.author) {
            console.log('[SOFTWARE QUERY] 🔍 AUTHOR RAW OBJECT:');
            console.log(sw.author);
            console.log(
                '[SOFTWARE QUERY] AUTHOR KEYS:',
                Object.keys(sw.author),
            );
            console.log('[SOFTWARE QUERY] id:', sw.author.id);
            console.log('[SOFTWARE QUERY] email:', sw.author.email);
            console.log('[SOFTWARE QUERY] fullName:', sw.author.fullName);
            console.log('[SOFTWARE QUERY] bio:', sw.author.bio);
            console.log('[SOFTWARE QUERY] avatarUrl:', sw.author.avatarUrl);
        }

        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const metrics: SoftwareMetricDto[] = (sw.softwareMetrics ?? []).map(
            (sm) => ({
                metricId: sm.metricId,
                metricName: sm.metricName,
                higherIsBetter: sm.metric?.higherIsBetter ?? false,
                value: Number(sm.value),
            }),
        );

        const result = {
            id: sw.id,
            slug: sw.slug,
            name: sw.name,
            developer: sw.developer,
            shortDescription: sw.shortDescription,
            fullDescription: sw.fullDescription,
            websiteUrl: sw.websiteUrl,
            gitRepoUrl: sw.gitRepoUrl,
            logoUrl: sw.logoUrl,
            screenshotUrls: sw.screenshotUrls,
            usageCount: sw.usageCount,
            createdAt: sw.createdAt,
            updatedAt: sw.updatedAt,
            categories: (sw.categories ?? []).map((c) => ({
                id: c.id,
                slug: c.slug,
                name: c.name,
            })),
            author: sw.author
                ? {
                      id: sw.author.id,
                      fullName: sw.author.fullName || null,
                      avatarUrl: sw.author.avatarUrl || null,
                      bio: sw.author.bio || null,
                  }
                : {
                      id: 0,
                      fullName: 'Anonymous',
                      avatarUrl: null,
                      bio: null,
                  },
            factors: this.groupFactors(sw.softwareFactors ?? []),
            metrics,
        };

        console.log('[SOFTWARE QUERY] ✅ RETURNING AUTHOR FOR SLUG:', {
            slug: sw.slug,
            author: result.author,
        });

        return result;
    }

    async compareBySlug(
        slugA: string,
        slugB: string,
    ): Promise<SoftwareComparisonDto> {
        if (slugA === slugB) {
            throw new BadRequestException(
                'The two software slugs must be different',
            );
        }

        const relations = [
            'categories',
            'softwareFactors',
            'softwareMetrics',
            'softwareMetrics.metric',
        ];

        const [swA, swB] = await Promise.all([
            this.repo.findOne({ where: { slug: slugA }, relations }),
            this.repo.findOne({ where: { slug: slugB }, relations }),
        ]);

        if (!swA)
            throw new NotFoundException(
                `Software with slug '${slugA}' not found`,
            );
        if (!swB)
            throw new NotFoundException(
                `Software with slug '${slugB}' not found`,
            );

        if (swA.id === swB.id) {
            throw new BadRequestException(
                'The two software slugs must be different',
            );
        }

        const swACategoryIds = new Set(swA.categories.map((c) => c.id));
        const haveCommonCategory = swB.categories.some((c) =>
            swACategoryIds.has(c.id),
        );

        if (!haveCommonCategory) {
            throw new BadRequestException(
                'Software are not comparable. At least one category must be in common',
            );
        }

        const note = await this.comparisonNoteRepo.findOne({
            where: [
                { softwareAId: swA.id, softwareBId: swB.id },
                { softwareAId: swB.id, softwareBId: swA.id },
            ],
        });

        const aMetrics = new Map(
            (swA.softwareMetrics ?? []).map((sm) => [sm.metricId, sm]),
        );
        const bMetrics = new Map(
            (swB.softwareMetrics ?? []).map((sm) => [sm.metricId, sm]),
        );

        const allMetricIds = new Set([...aMetrics.keys(), ...bMetrics.keys()]);
        const metricsComparison: MetricComparisonItemDto[] = [];

        for (const metricId of allMetricIds) {
            const aSm = aMetrics.get(metricId);
            const bSm = bMetrics.get(metricId);
            const higherIsBetter =
                (aSm?.metric ?? bSm?.metric)?.higherIsBetter ?? false;
            const aValue = aSm ? Number(aSm.value) : null;
            const bValue = bSm ? Number(bSm.value) : null;
            const metricName = (aSm ?? bSm)!.metricName;

            let winner: 'a' | 'b' | null = null;
            if (aValue !== null && bValue !== null && aValue !== bValue) {
                winner = (higherIsBetter ? aValue > bValue : aValue < bValue)
                    ? 'a'
                    : 'b';
            }

            metricsComparison.push({
                metricId,
                metricName,
                higherIsBetter,
                aValue,
                bValue,
                winner,
            });
        }

        const aFactors = new Map(
            (swA.softwareFactors ?? []).map((sf) => [sf.factorId, sf]),
        );
        const bFactors = new Map(
            (swB.softwareFactors ?? []).map((sf) => [sf.factorId, sf]),
        );

        const allFactorIds = new Set([...aFactors.keys(), ...bFactors.keys()]);
        const factorsComparison: FactorComparisonItemDto[] = [];

        for (const factorId of allFactorIds) {
            const aSf = aFactors.get(factorId);
            const bSf = bFactors.get(factorId);

            const factorRef = (aSf ?? bSf)!;
            const factorName = factorRef.factorName;
            const isPositive = factorRef.isPositive;

            const hasA = aSf !== undefined;
            const hasB = bSf !== undefined;

            let winner: 'a' | 'b' | null = null;

            if (hasA !== hasB) {
                if (isPositive) {
                    winner = hasA ? 'a' : 'b';
                } else {
                    winner = hasA ? 'b' : 'a';
                }
            }

            factorsComparison.push({
                factorId,
                factorName,
                isPositive,
                hasA,
                hasB,
                winner,
            });
        }

        return {
            softwareA: this.toComparisonSide(swA),
            softwareB: this.toComparisonSide(swB),
            metricsComparison,
            factorsComparison,
            comparisonNote: note?.note ?? null,
        };
    }

    async findAlternatives(
        q: string | undefined,
        slug: string,
        page: number,
        perPage: number,
    ): Promise<PaginatedResponseDto<SoftwareListItemDto>> {
        const sw = await this.repo.findOneBy({ slug });
        if (!sw)
            throw new NotFoundException(
                `Software with slug '${slug}' not found`,
            );

        const target = await this.repo.findOne({
            where: { id: sw.id },
            relations: ['categories'],
        });

        if (!target || !target.categories.length) {
            return new PaginatedResponseDto([], 0, page, perPage);
        }

        const categoryIds = target.categories.map((c) => c.id);
        const qb = this.repo
            .createQueryBuilder('software')
            .leftJoinAndSelect('software.categories', 'category')
            .innerJoin(
                'software.categories',
                'sharedCat',
                'sharedCat.id IN (:...categoryIds)',
                { categoryIds },
            )
            .where('software.id != :softwareId', { softwareId: sw.id })
            .orderBy('software.usageCount', 'DESC')
            .skip((page - 1) * perPage)
            .take(perPage);

        if (q) {
            qb.andWhere(
                'software.name ILIKE :q OR software.shortDescription ILIKE :q',
                { q: `%${q}%` },
            );
        }

        const [items, total] = await qb.getManyAndCount();
        return new PaginatedResponseDto(
            items.map((s) => this.toListItem(s)),
            total,
            page,
            perPage,
        );
    }
}
