import { useSyncExternalStore, useCallback } from 'react';
import { useStorageManager } from './useStorageManager';
import { StorageManager } from '../core/StorageManager';
import type { MetadataOptions } from '../types/metadata';

// Overload 1: Context-based hook call
export function useStorageValue<T>(
    key: string,
    defaultValue?: T,
    options?: MetadataOptions
): [
    T | null,
    (value: T | ((prev: T | null) => T), options?: MetadataOptions) => void
];

// Overload 2: Direct StorageManager instance call
export function useStorageValue<T>(
    manager: StorageManager,
    key: string,
    defaultValue?: T,
    options?: MetadataOptions
): [
    T | null,
    (value: T | ((prev: T | null) => T), options?: MetadataOptions) => void
];

export function useStorageValue<T>(
    ...args: any[]
): [
    T | null,
    (value: T | ((prev: T | null) => T), options?: MetadataOptions) => void
] {
    const contextManager = useStorageManager();

    const hasExplicitManager = args[0] instanceof StorageManager;

    const manager = hasExplicitManager
        ? (args[0] as StorageManager)
        : contextManager;

    const key = hasExplicitManager
        ? (args[1] as string)
        : (args[0] as string);

    const defaultValue = hasExplicitManager
        ? (args[2] as T | undefined)
        : (args[1] as T | undefined);

    const options = hasExplicitManager
        ? (args[3] as MetadataOptions | undefined)
        : (args[2] as MetadataOptions | undefined);

    if (!manager) {
        throw new Error(
            'StorageManager is not configured. Either wrap your application in StorageProvider ' +
                'or pass a StorageManager instance as the first argument to useStorageValue.'
        );
    }

    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            return manager.subscribe(key, onStoreChange);
        },
        [manager, key]
    );

    const getSnapshot = useCallback((): T | null => {
        const val = manager.get<T>(key);
        return val !== null
            ? val
            : defaultValue !== undefined
              ? defaultValue
              : null;
    }, [manager, key, defaultValue]);

    const getServerSnapshot = useCallback((): T | null => {
        return defaultValue !== undefined ? defaultValue : null;
    }, [defaultValue]);

    const value = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const setValue = useCallback(
        (
            newValue: T | ((prev: T | null) => T),
            setOptions?: MetadataOptions
        ) => {
            const currentValue = manager.get<T>(key);
            const resolvedValue =
                typeof newValue === 'function'
                    ? (newValue as (prev: T | null) => T)(currentValue)
                    : newValue;

            manager.set(key, resolvedValue, {
                ...options,
                ...setOptions
            });
        },
        [manager, key, options]
    );

    return [value, setValue];
}
