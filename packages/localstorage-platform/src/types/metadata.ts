export interface Metadata {
    type: 'single' | 'group';

    group?: string;

    encrypt?: boolean;

    createdAt: number;

    updatedAt: number;

    expiresAt?: number;
}
export interface MetadataOptions {
    group?: string;

    ttl?: number;

    encrypt?: boolean;
}
export const createMetadata = ({ group, ttl, encrypt }: MetadataOptions): Metadata => {
    const now = Date.now();

    const expiresAt =
        ttl !== undefined
            ? now + ttl
            : undefined;



    return {
        type: group ? 'group' : 'single',

        ...(group && {
            group,
        }),

        createdAt: now,

        updatedAt: now,

        ...(expiresAt !== undefined && { expiresAt }),

        encrypt: encrypt ?? false
    }

}


//export const updateMetadata()  TODO next release




export const isExpired = (metadata: Metadata): boolean => {
    if (metadata.expiresAt === undefined) {
        return false;
    }
    return Date.now() >= metadata.expiresAt!;
}