import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    ConflictException,
    OnModuleInit,
    Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';

import { Role } from '@common/enums/role.enum';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import {
    SoftwareMarkedUsedEvent,
    SoftwareMarkedUnusedEvent,
} from '@common/events/software-usage.events';
import { User } from './entities/user.entity';
import { SoftwareUsage } from './entities/software-usage.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserDto } from './dto/user.dto';
import { adminConfig, type AdminConfig } from '@config/admin.config';
import type { PaginationQueryDto } from '@common/dto/pagination-query.dto';

interface AuthResult {
    token: string;
    user: UserDto;
}

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectPinoLogger(UsersService.name)
        private readonly logger: PinoLogger,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(SoftwareUsage)
        private readonly usageRepo: Repository<SoftwareUsage>,
        @Inject(adminConfig.KEY)
        private readonly admin: AdminConfig,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async onModuleInit() {
        const count = await this.userRepo.count();
        if (count === 0) {
            this.logger.info('Database is empty. Seeding default admin...');
            const passwordHash = await bcrypt.hash(this.admin.password, 10);
            await this.userRepo.save({
                email: this.admin.email,
                passwordHash,
                role: Role.ADMIN,
            });
        }
    }

    async register(dto: RegisterDto): Promise<AuthResult> {
        const existing = await this.userRepo.findOneBy({ email: dto.email });
        if (existing) {
            throw new ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.userRepo.save({
            email: dto.email,
            passwordHash,
        });
        return this.buildAuthResult(user);
    }

    async login(dto: LoginDto): Promise<AuthResult> {
        const user = await this.userRepo.findOneBy({ email: dto.email });
        if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResult(user);
    }

    async findAll(
        query: PaginationQueryDto,
    ): Promise<PaginatedResponseDto<UserDto>> {
        const page = query.page ?? 1;
        const perPage = query.perPage ?? 10;

        const [users, total] = await this.userRepo.findAndCount({
            order: { id: 'ASC' },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return new PaginatedResponseDto(
            users.map((u) => UserDto.from(u)),
            total,
            page,
            perPage,
        );
    }

    async findOne(id: number): Promise<UserDto> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return UserDto.from(user);
    }

    async makeAdmin(id: number): Promise<UserDto> {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        user.role = Role.ADMIN;
        const updated = await this.userRepo.save(user);
        return UserDto.from(updated);
    }

    async markSoftwareAsUsed(
        userId: number,
        softwareId: number,
    ): Promise<{ success: true }> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.usageRepo.findOneBy({ userId, softwareId });
        if (existing) throw new ConflictException('Already marked as used');

        await this.usageRepo.save({ userId, softwareId });

        this.eventEmitter.emit(
            SoftwareMarkedUsedEvent.eventName,
            new SoftwareMarkedUsedEvent(userId, softwareId),
        );

        return { success: true };
    }

    async markSoftwareAsUnused(
        userId: number,
        softwareId: number,
    ): Promise<{ success: true }> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        const existing = await this.usageRepo.findOneBy({ userId, softwareId });
        if (!existing) throw new NotFoundException('Usage record not found');

        await this.usageRepo.delete({ userId, softwareId });

        this.eventEmitter.emit(
            SoftwareMarkedUnusedEvent.eventName,
            new SoftwareMarkedUnusedEvent(userId, softwareId),
        );

        return { success: true };
    }

    async hasUserUsedSoftware(
        userId: number,
        softwareId: number,
    ): Promise<{ isUsed: boolean }> {
        const isUsed = await this.usageRepo.existsBy({ userId, softwareId });
        return { isUsed };
    }

    async updateProfile(
        userId: number,
        dto: UpdateProfileDto,
    ): Promise<UserDto> {
        console.log('[USERS SERVICE] updateProfile called for userId:', userId);
        console.log('[USERS SERVICE] updateProfile DTO:', dto);

        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user)
            throw new NotFoundException(`User with ID ${userId} not found`);

        if (dto.fullName !== undefined) user.fullName = dto.fullName;
        if (dto.bio !== undefined) user.bio = dto.bio;
        if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;
        if (dto.githubUrl !== undefined) user.githubUrl = dto.githubUrl;
        if (dto.linkedinUrl !== undefined) user.linkedinUrl = dto.linkedinUrl;

        const updated = await this.userRepo.save(user);
        console.log('[USERS SERVICE] updateProfile saved user:', {
            id: updated.id,
            fullName: updated.fullName,
            bio: updated.bio,
            avatarUrl: updated.avatarUrl,
        });
        return UserDto.from(updated);
    }

    async getUserSoftwareStack(userId: number): Promise<SoftwareUsage[]> {
        return this.usageRepo.find({
            where: { userId },
            relations: ['software', 'software.categories'],
            order: { createdAt: 'DESC' },
        });
    }

    private buildAuthResult(user: User): AuthResult {
        const token = this.jwtService.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            githubUrl: user.githubUrl,
            linkedinUrl: user.linkedinUrl,
        });
        return { token, user: UserDto.from(user) };
    }
}
