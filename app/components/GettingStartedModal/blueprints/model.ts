import type { PageMetadataData } from '../model';

export type BlueprintData = {
    id: string;
    description: string;
    // eslint-disable-next-line camelcase
    main_file_name: string;
    // eslint-disable-next-line camelcase
    tenant_name: string;
    // eslint-disable-next-line camelcase
    created_at: string;
    // eslint-disable-next-line camelcase
    updated_at: string;
    // eslint-disable-next-line camelcase
    created_by: string;
    // eslint-disable-next-line camelcase
    private_resource: boolean;
    visibility: string;
};

export type BlueprintsData = {
    metadata: PageMetadataData;
    items: BlueprintData[];
};
