import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'John Doe' })
    @IsString()
    @MaxLength(100)
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({ example: 'Full-stack developer' })
    @IsString()
    @MaxLength(500)
    @IsOptional()
    bio?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    @IsUrl()
    @IsOptional()
    avatarUrl?: string;

    @ApiPropertyOptional({ example: 'https://github.com/johndoe' })
    @IsUrl()
    @IsOptional()
    githubUrl?: string;

    @ApiPropertyOptional({ example: 'https://linkedin.com/in/johndoe' })
    @IsUrl()
    @IsOptional()
    linkedinUrl?: string;
}
