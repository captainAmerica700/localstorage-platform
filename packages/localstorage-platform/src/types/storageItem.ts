import type { Metadata } from './metadata'
export interface StorageItem<T = unknown> {
    value: T;

    meta: Metadata;
}
