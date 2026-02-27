import { ApiProperty } from '@nestjs/swagger';

export class CreateCriterionDto {
    @ApiProperty({ example: 'Price (USD)', description: 'Display name of the criterion' })
    name: string;

    @ApiProperty({ example: 'number', description: 'Data type for frontend form generation' })
    type: 'boolean' | 'number' | 'string';

    @ApiProperty({ example: 10, description: 'Importance weight for calculating the overall score' })
    weight: number;
}