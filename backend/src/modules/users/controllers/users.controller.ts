import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    Req,
    Res,
    Inject,
} from '@nestjs/common';
import type { Response } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiOkResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@common/enums/role.enum';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { PaginationQueryDto } from '@common/dto/pagination-query.dto';
import { PaginatedOf } from '@common/dto/paginated-response.dto';
import { DataOf } from '@common/dto/response.dto';
import { SuccessResponseDto } from '@common/dto/success-response.dto';
import { IsUsedResponseDto } from '../dto/is-used-response.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersService } from '../users.service';
import { UserDto } from '../dto/user.dto';
import type { AuthenticatedRequest } from '@common/interfaces/jwt-payload.interface';
import { authConfig, type AuthConfig } from '@config/auth.config';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @Inject(authConfig.KEY)
        private readonly auth: AuthConfig,
    ) {}

    @Patch('me')
    @Authenticated()
    @ApiOperation({ summary: 'Update the authenticated user profile' })
    @ApiOkResponse({ type: DataOf(UserDto) })
    async updateProfile(
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: Response,
        @Body() dto: UpdateProfileDto,
    ) {
        const updated = await this.usersService.updateProfile(req.user.id, dto);

        // Issue a new JWT token with updated user data
        const token = this.jwtService.sign({
            id: updated.id,
            email: updated.email,
            role: updated.role,
            fullName: updated.fullName,
            bio: updated.bio,
            avatarUrl: updated.avatarUrl,
            githubUrl: updated.githubUrl,
            linkedinUrl: updated.linkedinUrl,
        });
        console.log(
            '[USERS CONTROLLER] Setting new JWT cookie with updated user data',
        );
        res.cookie(this.auth.cookieName, token, this.auth.cookieOptions);

        return updated;
    }

    @Get('me/software')
    @Authenticated()
    @ApiOperation({ summary: "Get the authenticated user's software stack" })
    @ApiOkResponse()
    async getMyStack(@Req() req: AuthenticatedRequest) {
        const usages = await this.usersService.getUserSoftwareStack(
            req.user.id,
        );
        return usages.map((u) => ({
            id: u.software.id,
            slug: u.software.slug,
            name: u.software.name,
            logoUrl: u.software.logoUrl,
            shortDescription: u.software.shortDescription,
            usageCount: u.software.usageCount,
            categories: (u.software.categories ?? []).map((c) => c.name),
        }));
    }

    @Get()
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Get paginated list of users (admin only)' })
    @ApiOkResponse({ type: PaginatedOf(UserDto) })
    findAll(@Query() query: PaginationQueryDto) {
        return this.usersService.findAll(query);
    }

    @Get(':userId')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiOkResponse({ type: DataOf(UserDto) })
    findOne(@Param('userId', ParseIntPipe) userId: number) {
        return this.usersService.findOne(userId);
    }

    @Patch(':id/make-admin')
    @Authenticated(Role.ADMIN)
    @ApiOperation({ summary: 'Promote a user to admin (admin only)' })
    @ApiOkResponse({ type: DataOf(UserDto) })
    makeAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.makeAdmin(id);
    }

    @Get('software/has-used/:softwareId')
    @Authenticated()
    @ApiOperation({
        summary:
            'Get whether a software is used by the authenticated user or not',
    })
    @ApiOkResponse({ type: DataOf(IsUsedResponseDto) })
    hasUsed(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.hasUserUsedSoftware(req.user.id, softwareId);
    }

    @Post('software/:softwareId/use')
    @Authenticated()
    @ApiOperation({
        summary: 'Mark a software as used by the authenticated user',
    })
    @ApiCreatedResponse({ type: DataOf(SuccessResponseDto) })
    markAsUsed(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markSoftwareAsUsed(req.user.id, softwareId);
    }

    @Delete('software/:softwareId/use')
    @Authenticated()
    @ApiOperation({
        summary: "Remove a software from the authenticated user's used list",
    })
    @ApiOkResponse({ type: DataOf(SuccessResponseDto) })
    markAsUnused(
        @Req() req: AuthenticatedRequest,
        @Param('softwareId', ParseIntPipe) softwareId: number,
    ) {
        return this.usersService.markSoftwareAsUnused(req.user.id, softwareId);
    }
}
