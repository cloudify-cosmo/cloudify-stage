import type { MarketplaceTab } from '../../../common/src/blueprintMarketplace/types';

export const MARKETPLACE_TABS: MarketplaceTab[] = [
    {
        name: 'AWS',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/aws_services.json'
    },
    {
        name: 'Azure',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/azure_services.json'
    },
    {
        name: 'GCP',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/gcp_services.json'
    },
    {
        name: 'Terraform',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/terraform_services.json'
    },
    {
        name: 'Helm',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/helm_services.json'
    },
    {
        name: 'Other',
        url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/other_services.json'
    }
];
