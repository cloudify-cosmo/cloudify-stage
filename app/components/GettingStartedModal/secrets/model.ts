import type { PageMetadataData } from '../model';

export type SecretData = {
    key: string;
    visibility: string; // TODO: tenant, etc.
};

export type SecretsData = {
    metadata: PageMetadataData;
    items: SecretData[];
};
