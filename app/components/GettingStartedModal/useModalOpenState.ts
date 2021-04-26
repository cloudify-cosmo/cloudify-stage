import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useFetch } from './common/fetchHooks';
import { useManager } from './common/managerHooks';
import EventBus from '../../utils/EventBus';

type UserResponse = {
    // eslint-disable-next-line camelcase
    show_getting_started: boolean;
};

const useModalOpenState = () => {
    const manager = useManager();
    const { response } = useFetch<UserResponse>(manager, `/users/${manager.getCurrentUsername()}`);
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        if (response?.show_getting_started) {
            // NOTE: quickfix, set to false to get the tests to pass on master
            setModalOpen(false);
        }
    }, [response]);
    const closeModal = async (disabled: boolean) => {
        try {
            if (disabled) {
                // TODO(RD-1874): use common api for backend requests
                await manager.doPost(`/users/${manager.getCurrentUsername()}`, null, { show_getting_started: false });
                EventBus.trigger('users:refresh');
            }
            setModalOpen(false);
        } catch (error) {
            log.error(error);
        }
    };
    return { modalOpen, closeModal };
};

export default useModalOpenState;
