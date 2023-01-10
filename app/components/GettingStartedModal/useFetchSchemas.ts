import { useEffect, useState } from 'react';
import { useResettableState } from '../../utils/hooks';
import type { GettingStartedSchema } from './model';

function useFetchSchemas() {
    const [gettingStartedSchema, setGettingStartedSchema] = useState<GettingStartedSchema | null>(null);
    const [cloudSetupSchema, setCloudSetupSchema] = useState<GettingStartedSchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError, clearError] = useResettableState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json')
                .then(response => response.json())
                .then(response => {
                    setGettingStartedSchema(response as GettingStartedSchema);
                }),
            fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json')
                .then(response => response.json())
                .then(response => {
                    setCloudSetupSchema(response as GettingStartedSchema);
                })
        ])
            .catch(err => {
                setError(err);
            })
            .finally(() => setLoading(false));
    }, []);

    return [gettingStartedSchema, cloudSetupSchema, error, clearError, loading] as const;
}

export default useFetchSchemas;
