import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useFetch } from './common/fetchHooks';
import { useManager } from './common/managerHooks';

type UserResponse = {
    // eslint-disable-next-line camelcase
    show_getting_started: boolean;
};

const useModalState = () => {
    const manager = useManager();
    const { response } = useFetch<UserResponse>(manager, `/users/${manager.getCurrentUsername()}`);
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        if (response?.show_getting_started) {
            setModalOpen(true);
        }
    }, [response]);
    const closeModal = async (disabled: boolean) => {
        try {
            if (disabled) {
                // TODO(RD-1874): use common api for backend requests
                await manager.doPost(`/users/${manager.getCurrentUsername()}`, null, { show_getting_started: false });
            }
            setModalOpen(false);
        } catch (error) {
            log.error(error);
        }
    };
    return { modalOpen, closeModal };
};

export default useModalState;
