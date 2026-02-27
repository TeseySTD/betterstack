import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'ides', description: 'Unique ID for URL' })
    slug: string;

    @ApiProperty({ example: 'IDEs & Code Editors' })
    name: string;

    @ApiProperty({ example: 'Tools for writing and debugging code' })
    description: string;
}