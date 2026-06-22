import type { Metadata } from '../types/metadata'
import type { StorageItem } from '../types/storageItem'
import { createNamespacedKey } from '../utils/namespace'

export class StorageManager {
    constructor(
        private readonly namespace: string
    ) {
        return;
    }
    private getKey(
        key: string
    ): string {
        return createNamespacedKey(
            this.namespace,
            key
        );
    }

    set<T>(
        key: string,
        value: T,
        group?: string
    ): void {
        try {
            const namespacedKey =
                this.getKey(key);

            const now = Date.now();

            const item: StorageItem<T> = {
                value,
                meta: {
                    type: group ? 'group' : 'single',

                    ...(group && {
                        group,
                    }),

                    createdAt: now,

                    updatedAt: now,
                }
            };

            localStorage.setItem(
                namespacedKey,
                JSON.stringify(item)
            );
        } catch (err) {
            console.error('[StorageManager:set]', err)
        }
    }

    get<T>(
        key: string
    ): T | null {
        const namespacedKey =
            this.getKey(key);

        const item =
            localStorage.getItem(
                namespacedKey
            );

        if (!item) {
            return null;
        }

        try {
            const parsed: StorageItem<T> =
                JSON.parse(item);

            return parsed.value;
        } catch {
            return null;
        }
    }

    has(
        key: string
    ): boolean {
        const namespacedKey =
            this.getKey(key);

        return localStorage.getItem(
            namespacedKey
        ) !== null;
    }

    getMetadata(
        key: string
    ): Metadata | null {
        const namespacedKey =
            this.getKey(key);

        const item =
            localStorage.getItem(
                namespacedKey
            );

        if (!item) {
            return null;
        }

        try {
            const parsed: StorageItem<unknown> =
                JSON.parse(item);

            return parsed.meta;
        } catch {
            return null;
        }
    }

    remove(
        key: string
    ): void {
        const namespacedKey =
            this.getKey(key);

        try {
            localStorage.removeItem(
                namespacedKey
            );
        } catch (error) {
            console.error(
                `[StorageManager:remove:${key}]`,
                error
            );
        }
    }

}