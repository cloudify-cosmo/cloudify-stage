import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import GettingStartedModal from './GettingStartedModal';
import type { GettingStartedSchema } from './model';

const GettingStartedWrapper = () => {
    const [gettingStartedSchema, setGettingStartedSchema] = useState<GettingStartedSchema | null>(null);
    const [cloudSetupSchema, setCloudSetupSchema] = useState<GettingStartedSchema | null>(null);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/gettingStarted.schema.json')
            .then(response => response.json())
            .then(response => {
                setGettingStartedSchema(response as GettingStartedSchema);
            })
            .catch(error => {
                setError(error);
            });
        fetch('https://repository.cloudifysource.org/cloudify/getting-started/6.4/cloudSetup.schema.json')
            .then(response => response.json())
            .then(response => {
                setCloudSetupSchema(response as GettingStartedSchema);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    if (error) {
        return (
            <Modal open>
                <Modal.Header>Failed to open the setup</Modal.Header>
                <Modal.Content>Failed to open the setup. Please try again.</Modal.Content>
                <Modal.Actions>
                    <Button content="Close" onClick={() => setError(null)} />
                </Modal.Actions>
            </Modal>
        );
    }

    if (gettingStartedSchema && cloudSetupSchema) {
        return <GettingStartedModal gettingStartedSchema={gettingStartedSchema} cloudSetupSchema={cloudSetupSchema} />;
    }

    return null;
};

export default GettingStartedWrapper;
