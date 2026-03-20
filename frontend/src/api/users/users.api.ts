import type { KyInstance } from 'ky';
import {
    unwrapResponse,
    unwrapPaginatedResponse,
    unwrapSuccessResponse,
} from '../common/common.utils';
import { type User, UserSchema } from '../auth/auth.schemas';
import type { Paginated, PaginationQuery } from '../common/common.types';
import {
    IsUsedResponseSchema,
    type IsUsedResponse,
    type UpdateProfileInput,
} from './users.schemas';
import {
    SoftwareListItemSchema,
    type SoftwareListItem,
} from '../software/software.schemas';

export async function listUsers(
    client: KyInstance,
    query?: PaginationQuery,
): Promise<Paginated<User>> {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set('page', String(query.page));
    if (query?.perPage !== undefined)
        searchParams.set('perPage', String(query.perPage));

    const raw = await client.get('users', { searchParams }).json();
    return unwrapPaginatedResponse(UserSchema, raw);
}

export async function getUserById(
    client: KyInstance,
    userId: number,
): Promise<User> {
    const raw = await client.get(`users/${userId}`).json();
    return unwrapResponse(UserSchema, raw);
}

export async function makeAdmin(
    client: KyInstance,
    userId: number,
): Promise<User> {
    const raw = await client.patch(`users/${userId}/make-admin`).json();
    return unwrapResponse(UserSchema, raw);
}

export async function markSoftwareAsUsed(
    client: KyInstance,
    softwareId: number,
): Promise<void> {
    const raw = await client.post(`users/software/${softwareId}/use`).json();
    unwrapSuccessResponse(raw);
}

export async function markSoftwareAsUnused(
    client: KyInstance,
    softwareId: number,
): Promise<void> {
    const raw = await client.delete(`users/software/${softwareId}/use`).json();
    unwrapSuccessResponse(raw);
}

export async function hasUserUsedSoftware(
    client: KyInstance,
    softwareId: number,
): Promise<IsUsedResponse> {
    const raw = await client
        .get(`users/software/has-used/${softwareId}`)
        .json();
    return unwrapResponse(IsUsedResponseSchema, raw);
}

export async function updateProfile(
    client: KyInstance,
    input: UpdateProfileInput,
): Promise<User> {
    const raw = await client.patch('users/me', { json: input }).json();
    return unwrapResponse(UserSchema, raw);
}

export async function getMyStack(
    client: KyInstance,
): Promise<SoftwareListItem[]> {
    const raw = await client.get('users/me/software').json();
    return unwrapResponse(SoftwareListItemSchema.array(), raw);
}
