import { describe, it, expect } from 'vitest';
import { StorageManager } from '../src/core/StorageManager';
import { CleanupManager } from '../src/core/CleanupManager';
describe('CleanupManager', () => {
    const storage = new StorageManager(
        'jaiStudios'
    );

    const cleanup = new CleanupManager(
        'jaiStudios',
        storage
    );
    it('placeholder', () => {
        expect(true).toBe(true);
    });
    it('should clear all keys in a group', () => {
        storage.set(
            'user',
            { id: 1 },
            'session'
        );

        storage.set(
            'booking',
            { id: 10 },
            'session'
        );

        storage.set(
            'theme',
            'dark'
        );

        cleanup.clearGroup(
            'session'
        );

        expect(
            storage.get('user')
        ).toBeNull();

        expect(
            storage.get('booking')
        ).toBeNull();

        expect(
            storage.get('theme')
        ).toBe('dark');
    });

    it('should clear all namespaced keys', () => {
        storage.set(
            'user',
            { id: 1 }
        );

        storage.set(
            'theme',
            'dark'
        );

        cleanup.clearAll();

        expect(
            storage.get('user')
        ).toBeNull();

        expect(
            storage.get('theme')
        ).toBeNull();
    });
    it('should not clear keys from another namespace', () => {
        const appA =
            new StorageManager('app-a');

        const appB =
            new StorageManager('app-b');

        appA.set(
            'theme',
            'dark'
        );

        appB.set(
            'theme',
            'light'
        );

        const cleanupA =
            new CleanupManager(
                'app-a',
                appA
            );

        cleanupA.clearAll();

        expect(
            appB.get('theme')
        ).toBe('light');
    });
});