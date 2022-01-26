import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useFetch } from './common/fetchHooks';
import { useManager } from './common/managerHooks';
import EventBus from '../../utils/EventBus';
import useGettingStartedUrlParam from './useGettingStartedUrlParam';

type UserResponse = {
    // eslint-disable-next-line camelcase
    show_getting_started: boolean;
};

const useModalOpenState = () => {
    const manager = useManager();
    const { response } = useFetch<UserResponse>(manager, `/users/${manager.getCurrentUsername()}`);
    const [modalOpen, setModalOpen] = useState(false);
    const [shouldAutomaticallyShowModal, setShouldAutomaticallyShowModal] = useState(false);
    const [gettingStartedUrlParam, deleteGettingStartedUrlParam] = useGettingStartedUrlParam();

    useEffect(() => {
        if (response?.show_getting_started) {
            setShouldAutomaticallyShowModal(true);
            setModalOpen(true);
        }
    }, [response]);

    useEffect(() => {
        if (gettingStartedUrlParam) {
            setModalOpen(true);
        }
    }, [gettingStartedUrlParam]);

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
            deleteGettingStartedUrlParam();
        } catch (error) {
            log.error(error);
        }
    };
    return { modalOpen, closeModal, shouldAutomaticallyShowModal };
};

export default useModalOpenState;
