import React from 'react';
import { Button, Modal } from '../basic';
import GettingStartedModal from './GettingStartedModal';
import useFetchSchemas from './useFetchSchemas';

const GettingStartedWrapper = () => {
    const [gettingStartedSchema, cloudSetupSchema, error, clearError] = useFetchSchemas();

    if (error) {
        return (
            <Modal open>
                <Modal.Header>Failed to open the setup</Modal.Header>
                <Modal.Content>Failed to open the setup. Please try again.</Modal.Content>
                <Modal.Actions>
                    <Button content="Close" onClick={clearError} />
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
