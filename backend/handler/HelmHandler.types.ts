export interface ClusterCredential {
    source: 'input' | 'secret';
    value: string;
}

export type ClusterCredentialName = 'host' | 'api_key' | 'ssl_ca_cert';

export interface HelmRenderParams {
    description?: string;
    repository: string;
    chart?: string;
    clusterCredentials: Record<ClusterCredentialName, ClusterCredential>;
}
