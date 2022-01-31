import { useSelector } from 'react-redux';
import { useBoolean } from '../../utils/hooks';
import { ReduxState } from '../../reducers';
import consts from '../../utils/consts';

const useModalOpenState = () => {
    const isUserUsingCommunity = useSelector(
        (state: ReduxState) => state.manager.version.edition === consts.EDITION.PREMIUM
    );
    const [isModalOpen, _setModalOpen, setModalClose] = useBoolean(isUserUsingCommunity);

    return { isModalOpen, setModalClose };
};

export default useModalOpenState;
