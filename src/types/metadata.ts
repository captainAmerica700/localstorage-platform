export interface Metadata {
    type: 'single' | 'group';

    group?: string;

    createdAt: number;

    updatedAt: number;

    ttl?: number;

    encrypted?: boolean;
}