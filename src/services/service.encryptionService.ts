import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import type { EncryptionOptions } from "../types/encryption";

export class EncryptionService {
    constructor(
        private readonly options: EncryptionOptions
    ) { }

    encrypt<T>(
        value: T
    ): string {
        const serializedValue = this.serialize(value);

        return AES.encrypt(
            serializedValue,
            this.options.secret
        ).toString();
    }


    decrypt<T>(
        encryptedValue: string
    ): T {
        const decrypted = AES.decrypt(
            encryptedValue,
            this.options.secret
        );

        const serializedValue = decrypted.toString(Utf8);

        return this.deserialize<T>(
            serializedValue
        );
    }

    private serialize<T>(
        value: T
    ): string {
        return JSON.stringify(value)
    }


    private deserialize<T>(
        value: string
    ): T {
        return JSON.parse(value)
    }

}