import { z } from 'zod';
import { CategoryListItemSchema } from '../categories/categories.schemas';
import { UserSchema } from '../auth/auth.schemas';

export const SoftwareListItemSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    logoUrl: z.string().nullable(),
    shortDescription: z.string(),
    usageCount: z.number(),
    categories: z.array(z.string()),
});
export type SoftwareListItem = z.infer<typeof SoftwareListItemSchema>;

export const SoftwareFactorEntrySchema = z.object({
    factorId: z.number(),
    factorName: z.string(),
});
export type SoftwareFactorEntry = z.infer<typeof SoftwareFactorEntrySchema>;

export const SoftwareMetricEntrySchema = z.object({
    metricId: z.number(),
    metricName: z.string(),
    higherIsBetter: z.boolean(),
    value: z.number(),
});
export type SoftwareMetricEntry = z.infer<typeof SoftwareMetricEntrySchema>;

export const SoftwareAuthorSchema = z.object({
    id: z.number(),
    fullName: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
});
export type SoftwareAuthor = z.infer<typeof SoftwareAuthorSchema>;

export const SoftwareDetailSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    developer: z.string(),
    shortDescription: z.string(),
    fullDescription: z.string().nullable(),
    websiteUrl: z.string().nullable(),
    gitRepoUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    screenshotUrls: z.array(z.string()),
    usageCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    categories: z.array(CategoryListItemSchema),
    author: SoftwareAuthorSchema,
    factors: z.object({
        positive: z.array(SoftwareFactorEntrySchema),
        negative: z.array(SoftwareFactorEntrySchema),
    }),
    metrics: z.array(SoftwareMetricEntrySchema),
});
export type SoftwareDetail = z.infer<typeof SoftwareDetailSchema>;

export const SoftwareComparisonSideSchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    developer: z.string(),
    shortDescription: z.string(),
    websiteUrl: z.string().nullable(),
    gitRepoUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    screenshotUrls: z.array(z.string()),
    usageCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    categories: z.array(CategoryListItemSchema),
    factors: z.object({
        positive: z.array(SoftwareFactorEntrySchema),
        negative: z.array(SoftwareFactorEntrySchema),
    }),
});
export type SoftwareComparisonSide = z.infer<
    typeof SoftwareComparisonSideSchema
>;

export const MetricComparisonEntrySchema = z.object({
    metricId: z.number(),
    metricName: z.string(),
    higherIsBetter: z.boolean(),
    aValue: z.number().nullable(),
    bValue: z.number().nullable(),
    winner: z.enum(['a', 'b']).nullable(),
});
export type MetricComparisonEntry = z.infer<typeof MetricComparisonEntrySchema>;

export const FactorComparisonEntrySchema = z.object({
    factorId: z.number(),
    factorName: z.string(),
    isPositive: z.boolean(),
    hasA: z.boolean(),
    hasB: z.boolean(),
    winner: z.enum(['a', 'b']).nullable(),
});
export type FactorComparisonEntry = z.infer<typeof FactorComparisonEntrySchema>;

export const SoftwareComparisonSchema = z.object({
    softwareA: SoftwareComparisonSideSchema,
    softwareB: SoftwareComparisonSideSchema,
    metricsComparison: z.array(MetricComparisonEntrySchema),
    factorsComparison: z.array(FactorComparisonEntrySchema),
    comparisonNote: z.string().nullable(),
});
export type SoftwareComparison = z.infer<typeof SoftwareComparisonSchema>;

export const CreateSoftwareInputSchema = z.object({
    slug: z.string(),
    name: z.string().max(50),
    developer: z.string().optional(),
    shortDescription: z.string(),
    fullDescription: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    gitRepoUrl: z.string().url().optional(),
    logoUrl: z.string().url().optional(),
    screenshotUrls: z.array(z.string().url()).optional(),
});
export type CreateSoftwareInput = z.infer<typeof CreateSoftwareInputSchema>;

export const UpdateSoftwareInputSchema = CreateSoftwareInputSchema.partial();
export type UpdateSoftwareInput = z.infer<typeof UpdateSoftwareInputSchema>;

export const UpdateSoftwareFactorsInputSchema = z.object({
    factors: z.array(
        z.object({
            factorId: z.number(),
            isPositive: z.boolean(),
        }),
    ),
});
export type UpdateSoftwareFactorsInput = z.infer<
    typeof UpdateSoftwareFactorsInputSchema
>;

export const UpdateSoftwareMetricsInputSchema = z.object({
    metrics: z.array(
        z.object({
            metricId: z.number(),
            value: z.number(),
        }),
    ),
});
export type UpdateSoftwareMetricsInput = z.infer<
    typeof UpdateSoftwareMetricsInputSchema
>;

export const SoftwareListQuerySchema = z.object({
    q: z.string().optional(),
    page: z.number().int().positive().optional(),
    perPage: z.number().int().positive().optional(),
    categoryIds: z.array(z.number()).optional(),
});
export type SoftwareListQuery = z.infer<typeof SoftwareListQuerySchema>;
