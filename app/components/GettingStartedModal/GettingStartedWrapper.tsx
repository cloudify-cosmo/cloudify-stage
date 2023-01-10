import React from 'react';
import StageUtils from '../../utils/stageUtils';
import { Button, Modal } from '../basic';
import GettingStartedModal from './GettingStartedModal';
import useFetchSchemas from './useFetchSchemas';

const t = StageUtils.getT('gettingStartedModal');

const GettingStartedWrapper = () => {
    const [gettingStartedSchema, cloudSetupSchema, error, clearError] = useFetchSchemas();

    if (error) {
        return (
            <Modal open>
                <Modal.Header>{t('errorModal.title')}</Modal.Header>
                <Modal.Content>{t('errorModal.description')}</Modal.Content>
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
