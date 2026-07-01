import { EncryptionService } from '../services/service.encryptionService';
import { createMetadata, isExpired } from '../types/metadata'
import type { Metadata, MetadataOptions } from '../types/metadata'
import type { StorageItem } from '../types/storageItem'
import type { StorageManagerOptions } from '../types/storagemanager';
import { createNamespacedKey } from '../utils/namespace'

export class StorageManager {
    private readonly encryptionService?: EncryptionService;
    constructor(
        private readonly namespace: string,
        options: StorageManagerOptions = {}
    ) {
        if (options.encryption) {
            this.encryptionService =
                new EncryptionService(options.encryption);
        }
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

        const namespacedKey =
            this.getKey(key);

        const meta = createMetadata(options)

        let storageValue: T | string = value;

        if (options.encrypt) {
            if (!this.encryptionService) {
                throw new Error(
                    "Encryption is enabled but no encryption service is configured."
                );
            }

            storageValue = this.encryptionService.encrypt(value);
        }

        const item: StorageItem<T | string> = {
            value: storageValue,
            meta
        };

        localStorage.setItem(
            namespacedKey,
            JSON.stringify(item)
        );

    }

    get<T>(
        key: string
    ): T | null {
        const item = this.getStorageItem<T | string>(key)
        if (!item) {
            return null;
        }
        if (item.meta.encrypt) {
            if (!this.encryptionService) {
                throw new Error(
                    'Encrypted value found but no encryption service is configured.'
                );
            }
            return this.encryptionService.decrypt<T>(
                item.value as string
            )
        }
        return item.value as T;
    }

    has(
        key: string
    ): boolean {
        return this.getStorageItem(key) !== null
    }

    getMetadata(
        key: string
    ): Metadata | null {
        const item = this.getStorageItem<unknown>(key)
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