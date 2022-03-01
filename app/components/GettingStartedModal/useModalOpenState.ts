import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useFetch } from './common/fetchHooks';
import useManager from '../../utils/hooks/useManager';
import EventBus from '../../utils/EventBus';
import useCloudSetupUrlParam from './useCloudSetupUrlParam';

type UserResponse = {
    // eslint-disable-next-line camelcase
    show_getting_started: boolean;
};

const useModalOpenState = () => {
    const manager = useManager();
    const { response } = useFetch<UserResponse>(manager, `/users/${manager.getCurrentUsername()}`);
    const [modalOpen, setModalOpen] = useState(false);
    const [shouldAutomaticallyShowModal, setShouldAutomaticallyShowModal] = useState(false);
    const [cloudSetupUrlParam, deleteCloudSetupUrlParam] = useCloudSetupUrlParam();

    useEffect(() => {
        if (response?.show_getting_started) {
            setShouldAutomaticallyShowModal(true);
            setModalOpen(true);
        }
    }, [response]);

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
