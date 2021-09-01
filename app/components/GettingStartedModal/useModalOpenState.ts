import { useEffect, useState } from 'react';
import log from 'loglevel';

import { useFetch } from './common/fetchHooks';
import { useManager } from './common/managerHooks';
import EventBus from '../../utils/EventBus';
import useSearchParam from '../../utils/hooks/useSearchParam';

type UserResponse = {
    // eslint-disable-next-line camelcase
    show_getting_started: boolean;
};

const gettingStartedParameterName = 'gettingStarted';
const gettingStartedParameterValue = 'true';

const useModalOpenState = () => {
    const manager = useManager();
    const { response } = useFetch<UserResponse>(manager, `/users/${manager.getCurrentUsername()}`);
    const [modalOpen, setModalOpen] = useState(false);
    const [gettingStartedParameter, , deleteGettingStartedParameter] = useSearchParam(gettingStartedParameterName);

    useEffect(() => {
        if (response?.show_getting_started) {
            setModalOpen(true);
        }
    }, [response]);

    useEffect(() => {
        if (gettingStartedParameter === gettingStartedParameterValue) {
            setModalOpen(true);
        }
    }, [gettingStartedParameter]);

    const closeModal = async (disabled: boolean) => {
        try {
            if (disabled) {
                // TODO(RD-1874): use common api for backend requests
                await manager.doPost(`/users/${manager.getCurrentUsername()}`, {
                    body: { show_getting_started: false }
                });
                EventBus.trigger('users:refresh');
            }
            setModalOpen(false);
            deleteGettingStartedParameter();
        } catch (error) {
            log.error(error);
        }
    };
    return { modalOpen, closeModal };
};

export default useModalOpenState;
