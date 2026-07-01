import { StorageManager } from './StorageManager'
import { isNamespacedKey, removeNamespace } from '../utils/namespace'
export class CleanupManager {
    constructor(
        private readonly namespace: string,
        private readonly storage: StorageManager
    ) {

    }


    private getNamespacedKeys(): string[] {
        const keys: string[] = [];

        for (
            let i = 0;
            i < localStorage.length;
            i++
        ) {
            const key =
                localStorage.key(i);

            if (!key) {
                continue;
            }

            if (
                isNamespacedKey(
                    this.namespace,
                    key
                )
            ) {
                keys.push(key);
            }
        }

        return keys;
    }

    clearGroup(
        group: string
    ): void {
        const keys =
            this.getNamespacedKeys();

        for (const namespacedKey of keys) {

            const key =
                removeNamespace(
                    this.namespace,
                    namespacedKey
                );

            const metadata =
                this.storage.getMetadata(
                    key
                );

            if (
                metadata?.group === group
            ) {
                this.storage.remove(
                    key
                );
            }
        }
    }



    clearAll(): void {
        const keys =
            this.getNamespacedKeys();

        for (const namespacedKey of keys) {

            const key =
                removeNamespace(
                    this.namespace,
                    namespacedKey
                );

            this.storage.remove(
                key
            );
        }
    }
}