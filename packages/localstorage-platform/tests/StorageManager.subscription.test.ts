import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager } from '../src/core/StorageManager';
import { CleanupManager } from '../src/core/CleanupManager';

describe('StorageManager Subscription System', () => {
    let storage: StorageManager;

    beforeEach(() => {
        localStorage.clear();
        storage = new StorageManager('testNamespace');
    });

    it('should notify key subscribers when value is set', () => {
        const themeListener = vi.fn();
        const userListener = vi.fn();

        storage.subscribe('theme', themeListener);
        storage.subscribe('user', userListener);

        storage.set('theme', 'dark');

        expect(themeListener).toHaveBeenCalledTimes(1);
        expect(userListener).not.toHaveBeenCalled();
    });

    it('should notify key subscribers when value is removed', () => {
        storage.set('theme', 'dark');

        const themeListener = vi.fn();
        storage.subscribe('theme', themeListener);

        storage.remove('theme');

        expect(themeListener).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe successfully', () => {
        const themeListener = vi.fn();
        const unsubscribe = storage.subscribe('theme', themeListener);

        unsubscribe();

        storage.set('theme', 'light');

        expect(themeListener).not.toHaveBeenCalled();
    });

    it('should notify subscribers on cross-tab window storage events', () => {
        const themeListener = vi.fn();
        storage.subscribe('theme', themeListener);

        // Dispatch a storage event matching the namespace and key
        const event = new StorageEvent('storage', {
            key: 'testNamespace:theme',
            newValue: JSON.stringify({ value: 'dark', meta: { type: 'single' } })
        });
        window.dispatchEvent(event);

        expect(themeListener).toHaveBeenCalledTimes(1);
    });

    it('should not notify subscribers on storage events for other namespaces', () => {
        const themeListener = vi.fn();
        storage.subscribe('theme', themeListener);

        // Dispatch a storage event with a different namespace
        const event = new StorageEvent('storage', {
            key: 'otherNamespace:theme',
            newValue: JSON.stringify({ value: 'dark', meta: { type: 'single' } })
        });
        window.dispatchEvent(event);

        expect(themeListener).not.toHaveBeenCalled();
    });

    it('should notify all active subscribers if localStorage is cleared (event.key is null)', () => {
        const themeListener = vi.fn();
        const userListener = vi.fn();

        storage.subscribe('theme', themeListener);
        storage.subscribe('user', userListener);

        const event = new StorageEvent('storage', {
            key: null
        });
        window.dispatchEvent(event);

        expect(themeListener).toHaveBeenCalledTimes(1);
        expect(userListener).toHaveBeenCalledTimes(1);
    });

    it('should trigger notifications when cleared via CleanupManager', () => {
        storage.set('theme', 'dark', { group: 'settings' });
        storage.set('layout', 'grid', { group: 'settings' });

        const themeListener = vi.fn();
        const layoutListener = vi.fn();

        storage.subscribe('theme', themeListener);
        storage.subscribe('layout', layoutListener);

        const cleanup = new CleanupManager('testNamespace', storage);
        cleanup.clearGroup('settings');

        expect(themeListener).toHaveBeenCalledTimes(1);
        expect(layoutListener).toHaveBeenCalledTimes(1);
    });

    it('should properly clean up listeners and remove event listener on destroy', () => {
        const spyRemoveEvent = vi.spyOn(window, 'removeEventListener');
        
        const themeListener = vi.fn();
        storage.subscribe('theme', themeListener);

        storage.destroy();

        expect(spyRemoveEvent).toHaveBeenCalledWith('storage', expect.any(Function));

        // Setting a key after destroy should not trigger since listeners map was cleared
        storage.set('theme', 'dark');
        expect(themeListener).not.toHaveBeenCalled();

        spyRemoveEvent.mockRestore();
    });

    it('should lazily register and unregister the global storage event listener', () => {
        const spyAddEvent = vi.spyOn(window, 'addEventListener');
        const spyRemoveEvent = vi.spyOn(window, 'removeEventListener');

        const listener = vi.fn();
        
        spyAddEvent.mockClear();
        spyRemoveEvent.mockClear();

        const unsubscribe = storage.subscribe('theme', listener);
        expect(spyAddEvent).toHaveBeenCalledWith('storage', expect.any(Function));

        unsubscribe();
        expect(spyRemoveEvent).toHaveBeenCalledWith('storage', expect.any(Function));

        spyAddEvent.mockRestore();
        spyRemoveEvent.mockRestore();
    });

    it('should share a single window storage event listener between multiple StorageManager instances', () => {
        const spyAddEvent = vi.spyOn(window, 'addEventListener');
        
        const storage2 = new StorageManager('otherNamespace');
        
        spyAddEvent.mockClear();

        const unsub1 = storage.subscribe('theme', () => {});
        expect(spyAddEvent).toHaveBeenCalledTimes(1);

        spyAddEvent.mockClear();

        const unsub2 = storage2.subscribe('theme', () => {});
        expect(spyAddEvent).not.toHaveBeenCalled();

        unsub1();
        unsub2();

        spyAddEvent.mockRestore();
    });
});
