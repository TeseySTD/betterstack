import {
    Controller,
    Post,
    Get,
    Body,
    Res,
    Req,
    HttpCode,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import type { Response } from 'express';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { UsersService } from '../users.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';
import { UserDto } from '../dto/user.dto';
import type { AuthenticatedRequest } from '@common/interfaces/jwt-payload.interface';
import { Authenticated } from '@common/decorators/authenticated.decorator';
import { authConfig, type AuthConfig } from '@config/auth.config';
import { DataOf } from '@common/dto/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(authConfig.KEY)
        private readonly auth: AuthConfig,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiCreatedResponse({ type: DataOf(AuthResponseDto) })
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const { token, user } = await this.usersService.register(dto);
        res.cookie(this.auth.cookieName, token, this.auth.cookieOptions);
        return { user };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login' })
    @ApiOkResponse({ type: DataOf(AuthResponseDto) })
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const { token, user } = await this.usersService.login(dto);
        res.cookie(this.auth.cookieName, token, this.auth.cookieOptions);
        return { user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Logout — clears the auth cookie' })
    @ApiNoContentResponse({ description: 'Cookie cleared' })
    logout(@Res({ passthrough: true }) res: Response): void {
        res.clearCookie(this.auth.cookieName, this.auth.cookieOptions);
    }

    @Get('me')
    @Authenticated()
    @ApiOperation({ summary: 'Return the currently authenticated user' })
    @ApiOkResponse({ type: DataOf(UserDto) })
    me(@Req() req: AuthenticatedRequest): UserDto {
        console.log('[AUTH CONTROLLER] me() called for userId:', req.user.id);
        const {
            id,
            email,
            role,
            fullName,
            bio,
            avatarUrl,
            githubUrl,
            linkedinUrl,
        } = req.user;
        const dto = new UserDto();
        dto.id = id;
        dto.email = email;
        dto.role = role;
        dto.fullName = fullName ?? null;
        dto.bio = bio ?? null;
        dto.avatarUrl = avatarUrl ?? null;
        dto.githubUrl = githubUrl ?? null;
        dto.linkedinUrl = linkedinUrl ?? null;
        console.log('[AUTH CONTROLLER] me() returning:', {
            id: dto.id,
            email: dto.email,
            role: dto.role,
            fullName: dto.fullName,
            bio: dto.bio,
            avatarUrl: dto.avatarUrl,
        });
        return dto;
    }
}
