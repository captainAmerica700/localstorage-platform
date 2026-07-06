import React, { createContext } from "react";
import type { StorageManager } from "../core/StorageManager";

export const StorageManagerContext = createContext<StorageManager | null>(null);

export interface StorageProviderProps {
    manager: StorageManager;
    children: React.ReactNode;
}

export function StorageProvider({
    manager,
    children,
}: StorageProviderProps): React.JSX.Element {
    return (
        <StorageManagerContext.Provider value={manager}>
            {children}
        </StorageManagerContext.Provider>
    );
}
