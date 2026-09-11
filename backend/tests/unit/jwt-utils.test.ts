import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

it('requires a signing secret', async () => {
    vi.stubEnv('JWT_SECRET', '');
    await expect(import('../../src/utils/jwt-utils')).rejects.toThrow('Set JWT_SECRET');
});

it('rejects short signing secrets', async () => {
    vi.stubEnv('JWT_SECRET', 'short');
    await expect(import('../../src/utils/jwt-utils')).rejects.toThrow('Set JWT_SECRET');
});

it('signs and verifies a user with an explicit test-only secret', async () => {
    vi.stubEnv('JWT_SECRET', 'unit-test-only-signing-secret-at-least-32-characters');
    const { signJwtToken, verifyJwtToken } = await import('../../src/utils/jwt-utils');
    expect(verifyJwtToken(signJwtToken('user-1'))).toMatchObject({ userId: 'user-1' });
    expect(() => verifyJwtToken('invalid-token')).toThrow();
});
