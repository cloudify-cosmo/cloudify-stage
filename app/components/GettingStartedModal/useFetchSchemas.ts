import { useEffect, useState } from 'react';
import { useResettableState } from '../../utils/hooks';
import type { GettingStartedSchema } from './model';

function useFetchSchemas() {
    const [gettingStartedSchema, setGettingStartedSchema] = useState<GettingStartedSchema | null>(null);
    const [cloudSetupSchema, setCloudSetupSchema] = useState<GettingStartedSchema | null>(null);
    const [error, setError, clearError] = useResettableState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json')
                .then(response => response.json())
                .then(response => {
                    setGettingStartedSchema(response);
                }),
            fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json')
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
