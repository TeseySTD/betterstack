import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SoftwareAuthorDto {
    @ApiProperty()
    id: number;

    @ApiPropertyOptional()
    fullName: string | null;

    @ApiPropertyOptional()
    avatarUrl: string | null;

    @ApiPropertyOptional()
    bio: string | null;
}
export class SoftwareListItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiPropertyOptional()
    logoUrl: string | null;

    @ApiProperty()
    shortDescription: string;

    @ApiProperty()
    usageCount: number;

    @ApiProperty({ type: [String] })
    categories: string[];
}

export class SoftwareFactorDto {
    @ApiProperty()
    factorId: number;

    @ApiProperty()
    factorName: string;
}

export class SoftwareFactorsDto {
    @ApiProperty({ type: [SoftwareFactorDto] })
    positive: SoftwareFactorDto[];

    @ApiProperty({ type: [SoftwareFactorDto] })
    negative: SoftwareFactorDto[];
}

export class SoftwareMetricDto {
    @ApiProperty()
    metricId: number;

    @ApiProperty()
    metricName: string;

    @ApiProperty()
    higherIsBetter: boolean;

    @ApiProperty()
    value: number;
}

export class SoftwareDetailDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    slug: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    developer: string;

    @ApiProperty()
    shortDescription: string;

    @ApiPropertyOptional()
    fullDescription: string | null;

    @ApiPropertyOptional()
    websiteUrl: string | null;

    @ApiPropertyOptional()
    gitRepoUrl: string | null;

    @ApiPropertyOptional()
    logoUrl: string | null;

    @ApiProperty({ type: [String] })
    screenshotUrls: string[];

    @ApiProperty()
    usageCount: number;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ type: SoftwareAuthorDto })
    author: SoftwareAuthorDto;

    @ApiProperty({ type: () => Array })
    categories: { id: number; slug: string; name: string }[];

    @ApiProperty({ type: () => SoftwareFactorsDto })
    factors: SoftwareFactorsDto;

    @ApiProperty({ type: [SoftwareMetricDto] })
    metrics: SoftwareMetricDto[];
}

export class SoftwareQueryDto {
    @ApiPropertyOptional({ description: 'Search by name or shortDescription' })
    q?: string;

    @ApiPropertyOptional({ example: 1, default: 1 })
    page?: number;

    @ApiPropertyOptional({ example: 10, default: 10 })
    perPage?: number;
}
