import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'ides', description: 'Unique ID for URL' })
    slug: string;

    @ApiProperty({ example: 'IDEs & Code Editors' })
    name: string;

    @ApiProperty({ example: 'Tools for writing and debugging code' })
    description: string;

    @ApiProperty({
        example: [1, 2, 3],
        description: 'Array of Criterion IDs that are mandatory for this category'
    })
    requiredCriteriaIds: number[];
}