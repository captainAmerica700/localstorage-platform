import { useContext } from 'react';
import { StorageManagerContext } from './StorageProvider';
import type { StorageManager } from '../core/StorageManager';

export function useStorageManager(): StorageManager | null {
    return useContext(StorageManagerContext);
}
