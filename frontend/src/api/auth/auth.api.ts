import type { KyInstance } from 'ky';
import { unwrapResponse } from '../common/common.utils';
import {
    UserSchema,
    AuthPayloadSchema,
    type User,
    type RegisterInput,
    type LoginInput,
    type AuthResponse,
} from './auth.schemas';

export async function register(
    client: KyInstance,
    input: RegisterInput,
): Promise<AuthResponse> {
    const raw = await client.post('auth/register', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function login(
    client: KyInstance,
    input: LoginInput,
): Promise<AuthResponse> {
    const raw = await client.post('auth/login', { json: input }).json();
    return unwrapResponse(AuthPayloadSchema, raw);
}

export async function logout(client: KyInstance): Promise<void> {
    await client.post('auth/logout');
}

export async function me(client: KyInstance): Promise<User> {
    // Add timestamp to bypass any caching
    const timestamp = Date.now();
    const raw = await client.get(`auth/me?t=${timestamp}`).json();
    return unwrapResponse(UserSchema, raw);
}
