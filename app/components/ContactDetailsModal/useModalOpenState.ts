import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from '../../utils/hooks';
import { ReduxState } from '../../reducers';
import consts from '../../utils/consts';
import Internal from '../../utils/Internal';
import { useManager } from '../GettingStartedModal/common/managerHooks';

interface ContactDetailsResponse {
    // eslint-disable-next-line camelcase
    details_received: boolean;
}

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
            internal.doGet('contactDetails/').then((response: ContactDetailsResponse) => {
                if (!response.details_received) {
                    openModal();
                }
            });
        }
    }, []);

    return { isModalOpen, closeModal };
};

export default useModalOpenState;
