import type { MetadataResponse } from '../model';

// from REST API

export type SecretResponse = {
    key: string;
    visibility: string;
};

export type SecretsResponse = {
    metadata: MetadataResponse;
    items: SecretResponse[];
};
