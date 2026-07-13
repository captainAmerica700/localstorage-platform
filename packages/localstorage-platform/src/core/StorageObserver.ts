import { isNamespacedKey, removeNamespace } from "../utils/namespace";

type Listener = () => void;

class StorageObserver {
    private readonly listeners = new Map<string, Map<string, Set<Listener>>>();
    private isListening = false;

    private readonly handleStorageEvent = (event: StorageEvent): void => {
        if (!event.key) {
            for (const [namespace, keys] of this.listeners.entries()) {
                for (const key of keys.keys()) {
                    this.notify(namespace, key);
                }
            }
            return;
        }

        for (const [namespace, keysMap] of this.listeners.entries()) {
            if (isNamespacedKey(namespace, event.key)) {
                const key = removeNamespace(namespace, event.key);
                if (keysMap.has(key)) {
                    this.notify(namespace, key);
                }
            }
        }
    };

    private setupListener(): void {
        if (!this.isListening && typeof window !== "undefined") {
            window.addEventListener("storage", this.handleStorageEvent);
            this.isListening = true;
        }
    }

    private teardownListener(): void {
        if (this.isListening && typeof window !== "undefined") {
            let totalListeners = 0;
            for (const keys of this.listeners.values()) {
                for (const listeners of keys.values()) {
                    totalListeners += listeners.size;
                }
            }
            if (totalListeners === 0) {
                window.removeEventListener("storage", this.handleStorageEvent);
                this.isListening = false;
            }
        }
    }

    subscribe(namespace: string, key: string, listener: Listener): () => void {
        let namespaceMap = this.listeners.get(namespace);
        if (!namespaceMap) {
            namespaceMap = new Map<string, Set<Listener>>();
            this.listeners.set(namespace, namespaceMap);
        }

        let keyListeners = namespaceMap.get(key);
        if (!keyListeners) {
            keyListeners = new Set<Listener>();
            namespaceMap.set(key, keyListeners);
        }

        keyListeners.add(listener);
        this.setupListener();

        return () => {
            const nsMap = this.listeners.get(namespace);
            if (!nsMap) return;

            const kListeners = nsMap.get(key);
            if (kListeners) {
                kListeners.delete(listener);
                if (kListeners.size === 0) {
                    nsMap.delete(key);
                }
            }

            if (nsMap.size === 0) {
                this.listeners.delete(namespace);
            }

            this.teardownListener();
        };
    }

    notify(namespace: string, key: string): void {
        const nsMap = this.listeners.get(namespace);
        if (!nsMap) return;

        const keyListeners = nsMap.get(key);
        if (keyListeners) {
            const snapshot = Array.from(keyListeners);
            snapshot.forEach((listener) => {
                try {
                    listener();
                } catch (error) {
                    console.error(
                        `[StorageObserver:notify:${namespace}:${key}]`,
                        error,
                    );
                }
            });
        }
    }

    clear(namespace: string): void {
        this.listeners.delete(namespace);
        this.teardownListener();
    }
}

export const storageObserver = new StorageObserver();
