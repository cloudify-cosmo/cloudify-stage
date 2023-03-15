export interface ClusterCredential {
    source: 'input' | 'secret';
    value: string;
}

export type ClusterCredentials = Record<ClusterCredentialName, ClusterCredential>;

export type ClusterCredentialName = 'host' | 'api_key' | 'ssl_ca_cert';

export interface HelmRenderParams {
    description?: string;
    repository: string;
    chart?: string;
    clusterCredentials: ClusterCredentials;
}
