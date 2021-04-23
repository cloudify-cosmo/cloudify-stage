// from REST API

export type SecretResponse = {
    key: string;
    visibility: string;
};

export type SecretsResponse = Stage.Types.PaginatedResponse<SecretResponse>;
