import { ApiProperty } from '@nestjs/swagger';

export class CreateSoftwareDto {
    @ApiProperty({ example: 1 })
    categoryId: number;

    @ApiProperty({ example: 'JetBrains Rider' })
    name: string;

    @ApiProperty({ example: 'https://jetbrains.com/rider' })
    websiteUrl: string;

    @ApiProperty({
        example: { 1: true, 2: 4.5 },
        description: 'Key - ID of criteria, Value - Value of the criterion'
    })
    features: Record<number, any>[];
}