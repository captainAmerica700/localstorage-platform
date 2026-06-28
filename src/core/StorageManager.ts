import { createMetadata, isExpired } from '../types/metadata'
import type { Metadata, MetadataOptions } from '../types/metadata'
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

    private getStorageItem<T>(key: string): StorageItem<T> | null {
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
            if (isExpired(parsed.meta)) {
                this.remove(key)
                return null
            }
            return parsed;
        } catch {
            return null;
        }
    }

    set<T>(
        key: string,
        value: T,
        options: MetadataOptions = {}
    ): void {
        try {
            const namespacedKey =
                this.getKey(key);

            const meta = createMetadata(options)

            const item: StorageItem<T> = {
                value,
                meta
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
        const item = this.getStorageItem<T>(key)
        return item?.value ?? null
    }

    has(
        key: string
    ): boolean {
        return this.getStorageItem(key) !== null
    }

    getMetadata(
        key: string
    ): Metadata | null {
        const item = this.getStorageItem<Metadata>(key)
        return item?.meta ?? null
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