import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { StorageManager } from '../src/core/StorageManager';

describe('StorageManager', () => {
    const storage = new StorageManager('jaiStudios');

    beforeEach(() => {
        localStorage.clear();
    });

    it('should set and get a value', () => {
        storage.set(
            'theme',
            'dark'
        );

        const result =
            storage.get<string>(
                'theme'
            );

        expect(result)
            .toBe('dark');
    });
    it('should check if key exists', () => {
        storage.set(
            'theme',
            'dark'
        );

        expect(
            storage.has('theme')
        ).toBe(true);

        expect(
            storage.has('missing')
        ).toBe(false);
    });
    it('should remove a key', () => {
        storage.set(
            'theme',
            'dark'
        );

        storage.remove(
            'theme'
        );

        expect(
            storage.get('theme')
        ).toBeNull();
    });
    it('should return metadata', () => {
        storage.set(
            'user',
            {
                id: 1,
                name: 'Jay'
            },
            {
                group: 'session'
            }
        );

        const metadata =
            storage.getMetadata(
                'user'
            );

        expect(
            metadata?.type
        ).toBe('group');

        expect(
            metadata?.group
        ).toBe('session');
    });
    it('should return null for missing key', () => {
        expect(
            storage.get('missing')
        ).toBeNull();

        expect(
            storage.getMetadata('missing')
        ).toBeNull();
    });
    it('should isolate data by namespace', () => {
        const storageA =
            new StorageManager('app-a');

        const storageB =
            new StorageManager('app-b');

        storageA.set(
            'theme',
            'dark'
        );

        expect(
            storageB.get('theme')
        ).toBeNull();
    });
    it('should create single metadata when group is not provided', () => {
        storage.set(
            'theme',
            'dark'
        );

        const metadata =
            storage.getMetadata(
                'theme'
            );

        expect(
            metadata?.type
        ).toBe('single');

        expect(
            metadata?.group
        ).toBeUndefined();
    });
    it('should return null for corrupted data', () => {
        localStorage.setItem(
            'jaiStudios:theme',
            'invalid-json'
        );

        expect(
            storage.get('theme')
        ).toBeNull();
    });
});
describe('ttl support', () => {
    const storage = new StorageManager('jaiStudios');
    beforeEach(() => {
        vi.useFakeTimers();

        localStorage.clear();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should create expiresAt when ttl is provided', () => {
        storage.set(
            'token',
            'abc',
            {
                ttl: 5000
            }
        );

        const metadata =
            storage.getMetadata('token');

        expect(metadata?.expiresAt)
            .toBeDefined();
    });
    it('should not create expiresAt when ttl is omitted', () => {
        storage.set(
            'token',
            'abc'
        );

        const metadata =
            storage.getMetadata('token');

        expect(metadata?.expiresAt)
            .toBeUndefined();
    });
    it('should return null after ttl expires', () => {
        storage.set(
            'token',
            'abc',
            {
                ttl: 1000
            }
        );

        vi.advanceTimersByTime(1001);

        expect(
            storage.get('token')
        ).toBeNull();
    });
    it('should remove expired item from localStorage', () => {
        storage.set(
            'token',
            'abc',
            {
                ttl: 1000
            }
        );

        vi.advanceTimersByTime(1001);

        storage.get('token');

        expect(
            localStorage.getItem(
                'jaiStudios:token'
            )
        ).toBeNull();
    });
})
describe('Encryption Support', () => {
    const storage = new StorageManager(
        'jaiStudios',
        {
            encryption: {
                secret: 'my-secret-key'
            }
        }
    );

    beforeEach(() => {
        localStorage.clear();
    });

    it('should encrypt and decrypt a value', () => {
        storage.set(
            'token',
            'abc123',
            {
                encrypt: true
            }
        );

        const value =
            storage.get<string>('token');

        expect(value)
            .toBe('abc123');
    });

    it('should not store plain text in localStorage', () => {
        storage.set(
            'token',
            'abc123',
            {
                encrypt: true
            }
        );

        const raw =
            localStorage.getItem(
                'jaiStudios:token'
            );

        expect(raw)
            .not.toContain('abc123');
    });

    it('should throw when encryption is enabled without configuration', () => {
        const storage =
            new StorageManager(
                'jaiStudios'
            );

        expect(() =>
            storage.set(
                'token',
                'abc123',
                {
                    encrypt: true
                }
            )
        ).toThrow();
    });

    it('should fail with an incorrect secret', () => {
        const storageA =
            new StorageManager(
                'app',
                {
                    encryption: {
                        secret: 'secret-one'
                    }
                }
            );

        const storageB =
            new StorageManager(
                'app',
                {
                    encryption: {
                        secret: 'secret-two'
                    }
                }
            );

        storageA.set(
            'token',
            'abc123',
            {
                encrypt: true
            }
        );

        expect(() =>
            storageB.get('token')
        ).toThrow();
    });

    it('should preserve metadata for encrypted values', () => {
        storage.set(
            'token',
            'abc123',
            {
                encrypt: true,
                group: 'session'
            }
        );

        const metadata =
            storage.getMetadata(
                'token'
            );

        expect(
            metadata?.encrypt
        ).toBe(true);

        expect(
            metadata?.group
        ).toBe('session');
    });

    it('should support ttl with encryption', () => {
        vi.useFakeTimers();

        storage.set(
            'token',
            'abc123',
            {
                encrypt: true,
                ttl: 1000
            }
        );

        vi.advanceTimersByTime(
            1001
        );

        expect(
            storage.get('token')
        ).toBeNull();

        vi.useRealTimers();
    });
});