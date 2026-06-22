import { describe, it, expect, beforeEach } from 'vitest';
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
            'session'
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