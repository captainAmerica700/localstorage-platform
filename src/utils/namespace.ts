export const createNamespacedKey = (
    namespace: string,
    key: string
): string =>
    `${namespace}:${key}`;

export const isNamespacedKey = (
    namespace: string,
    key: string
): boolean =>
    key.startsWith(
        `${namespace}:`
    );

export const removeNamespace = (
    namespace: string,
    key: string
): string =>
    key.replace(
        `${namespace}:`,
        ''
    );