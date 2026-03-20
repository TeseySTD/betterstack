import { Request } from 'express';
import { Role } from '@common/enums/role.enum';

export interface JwtPayload {
    id: number;
    email: string;
    role: Role;
    fullName?: string | null;
    bio?: string | null;
    avatarUrl?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
}

export type AuthenticatedRequest = Request & { user: JwtPayload };
