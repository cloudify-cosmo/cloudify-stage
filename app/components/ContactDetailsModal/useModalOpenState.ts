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
    const [isModalOpen, setModalOpen, setModalClose] = useBoolean(false);
    const userIsUsingCommunity = useSelector(
        (state: ReduxState) => state.manager.version.edition === consts.EDITION.COMMUNITY
    );
    const manager = useManager();
    const internal = new Internal(manager);

    useEffect(() => {
        if (userIsUsingCommunity) {
            internal.doGet('contactDetails/').then((response: ContactDetailsResponse) => {
                if (!response.details_received) {
                    setModalOpen();
                }
            });
        }
    }, []);

    return { isModalOpen, setModalClose };
};

export default useModalOpenState;
