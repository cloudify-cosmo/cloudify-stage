import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { GetContactDetailsResponse } from 'backend/routes/ContactDetails.types';
import { useBoolean } from '../../../../utils/hooks';
import type { ReduxState } from '../../../../reducers';
import consts from '../../../../utils/consts';
import Internal from '../../../../utils/Internal';
import useManager from '../../../../utils/hooks/useManager';

const useModalOpenState = () => {
    // Modal is opened ONLY if currently the user is using the Community version and has not submitted contact details yet
    const [isModalOpen, openModal, closeModal] = useBoolean(false);
    const userIsUsingCommunity = useSelector(
        (state: ReduxState) => state.manager.version.edition === consts.EDITION.COMMUNITY
    );
    const manager = useManager();
    const internal = new Internal(manager);

    useEffect(() => {
        if (userIsUsingCommunity) {
            internal.doGet<GetContactDetailsResponse>('contactDetails/').then(response => {
                if (!response.contactDetailsReceived) {
                    openModal();
                }
            });
        }
    }, []);

    return { isModalOpen, closeModal };
};

export default useModalOpenState;
