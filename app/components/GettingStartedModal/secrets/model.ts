import type { PageMetadataData } from '../model';

export type SecretData = {
    key: string;
    visibility: string;
};

export type SecretsData = {
    metadata: PageMetadataData;
    items: SecretData[];
};
