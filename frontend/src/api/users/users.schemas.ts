import { z } from 'zod';

export const IsUsedResponseSchema = z.object({ isUsed: z.boolean() });
export type IsUsedResponse = z.infer<typeof IsUsedResponseSchema>;

export const UpdateProfileInputSchema = z.object({
    fullName: z.string().max(100).optional(),
    bio: z.string().max(500).optional(),
    avatarUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    linkedinUrl: z.string().url().optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;
