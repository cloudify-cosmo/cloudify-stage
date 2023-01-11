import { useEffect, useState } from 'react';
import { useResettableState } from '../../utils/hooks';
import StageUtils from '../../utils/stageUtils';
import type { GettingStartedSchema } from './model';

export const gettingStartedSchemaUrl = StageUtils.Url.url(
    `/external/content?url=${encodeURIComponent(
        'https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json'
    )}`
);

export const cloudSetupSchemaUrl = StageUtils.Url.url(
    `/external/content?url=${encodeURIComponent(
        'https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json'
    )}`
);

function useFetchSchemas() {
    const [gettingStartedSchema, setGettingStartedSchema] = useState<GettingStartedSchema | null>(null);
    const [cloudSetupSchema, setCloudSetupSchema] = useState<GettingStartedSchema | null>(null);
    const [error, setError, clearError] = useResettableState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch(gettingStartedSchemaUrl)
                .then(response => response.json())
                .then(response => {
                    setGettingStartedSchema(response);
                }),
            fetch(cloudSetupSchemaUrl)
                .then(response => response.json())
                .then(response => {
                    setCloudSetupSchema(response);
                })
        ]).catch(err => {
            setError(err);
        });
    }, []);

    return [gettingStartedSchema, cloudSetupSchema, error, clearError] as const;
}

export default useFetchSchemas;
