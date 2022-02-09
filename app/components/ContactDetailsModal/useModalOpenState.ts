import { useSelector } from 'react-redux';
import { useBoolean } from '../../utils/hooks';
import { ReduxState } from '../../reducers';
import consts from '../../utils/consts';
import { useInternalFetch } from '../GettingStartedModal/common/fetchHooks';

interface ContactDetailsResponse {
    // eslint-disable-next-line camelcase
    details_submitted: boolean;
}

const useModalOpenState = () => {
    const { response } = useInternalFetch<ContactDetailsResponse>('contactDetails');
    // eslint-disable-next-line
    console.log(response);
    const isUserUsingCommunity = useSelector(
        (state: ReduxState) => state.manager.version.edition === consts.EDITION.PREMIUM
    );

    const detailsWereSubmitted = false;
    const shouldBeInitiallyOpen = isUserUsingCommunity && !detailsWereSubmitted;

    const [isModalOpen, _setModalOpen, setModalClose] = useBoolean(shouldBeInitiallyOpen);

    return { isModalOpen, setModalClose };
};

export default useModalOpenState;
