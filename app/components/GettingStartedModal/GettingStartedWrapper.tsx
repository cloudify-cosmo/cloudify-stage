import React, { useEffect, useState } from 'react';
import GettingStartedModal from './GettingStartedModal';
import { GettingStartedSchema } from './model';

const GettingStartedWrapper = () => {
    const [gettingStartedSchema, setGettingStartedSchema] = useState<GettingStartedSchema | null>(null);
    const [cloudSetupSchema, setCloudSetupSchema] = useState<GettingStartedSchema | null>(null);
    useEffect(() => {
        fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json')
            .then(response => response.json())
            .then(response => {
                setGettingStartedSchema(response as GettingStartedSchema);
            });
        fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json')
            .then(response => response.json())
            .then(response => {
                setCloudSetupSchema(response as GettingStartedSchema);
            });
    }, []);

    if (gettingStartedSchema && cloudSetupSchema) {
        return <GettingStartedModal gettingStartedSchema={gettingStartedSchema} cloudSetupSchema={cloudSetupSchema} />;
    }

    return null;
};

export default GettingStartedWrapper;
