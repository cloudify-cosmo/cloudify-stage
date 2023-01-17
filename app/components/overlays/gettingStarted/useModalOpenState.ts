import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useSelector } from 'react-redux';
import type { ReduxState } from '../../../reducers';
import useManager from '../../../utils/hooks/useManager';
import EventBus from '../../../utils/EventBus';
import useCloudSetupUrlParam from './useCloudSetupUrlParam';

const useModalOpenState = () => {
    const manager = useManager();
    const showGettingStarted = useSelector((state: ReduxState) => state.manager.auth.showGettingStarted);
    const [modalOpen, setModalOpen] = useState(false);
    const [shouldAutomaticallyShowModal, setShouldAutomaticallyShowModal] = useState(false);
    const [cloudSetupUrlParam, deleteCloudSetupUrlParam] = useCloudSetupUrlParam();

    useEffect(() => {
        if (showGettingStarted) {
            setShouldAutomaticallyShowModal(true);
            setModalOpen(true);
        }
    }, [showGettingStarted]);

    useEffect(() => {
        if (cloudSetupUrlParam) {
            setModalOpen(true);
        }
    }, [cloudSetupUrlParam]);

    const closeModal = async (shouldDisableModal: boolean) => {
        try {
            const modalVisibilityHasChanged = shouldDisableModal === shouldAutomaticallyShowModal;
            if (modalVisibilityHasChanged) {
                // TODO(RD-1874): use common api for backend requests
                await manager.doPost(`/users/${manager.getCurrentUsername()}`, {
                    body: { show_getting_started: !shouldDisableModal }
                });
                EventBus.trigger('users:refresh');
            }
            setModalOpen(false);
            deleteCloudSetupUrlParam();
        } catch (error) {
            log.error(error);
        }
    };
    return { modalOpen, closeModal, shouldAutomaticallyShowModal };
};

export default useModalOpenState;
