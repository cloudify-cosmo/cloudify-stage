import React, { memo, useReducer } from 'react';

import gettingStartedSchema from './schema';
import { getGettingStartedModalDisabled, setGettingStartedModalDisabled } from './localStorage';
import ControlledGettingStartedModal from './ControlledGettingStartedModal';

type ModalState = {
    modalOpen: boolean;
};

type ModalAction = {
    type: 'closeModal';
    permanent?: boolean;
};

const initialModalState: ModalState = {
    modalOpen: getGettingStartedModalDisabled()
};

const reduceModalState = (state: ModalState, action: ModalAction): ModalState => {
    switch (action.type) {
        case 'closeModal':
            if (action.permanent === true) {
                setGettingStartedModalDisabled(true);
            }
            return { modalOpen: false };
        default:
            throw new Error();
    }
    return state;
};

const StandaloneGettingStartedModal = () => {
    const [modalState, dispatchModalState] = useReducer(reduceModalState, initialModalState);
    const handleModalClose = (permanentClose: boolean) => {
        dispatchModalState({
            type: 'closeModal',
            permanent: permanentClose
        });
    };
    return (
        <ControlledGettingStartedModal
            open={modalState.modalOpen}
            step={0}
            schema={gettingStartedSchema}
            onClose={handleModalClose}
        />
    );
};

export default memo(StandaloneGettingStartedModal);
