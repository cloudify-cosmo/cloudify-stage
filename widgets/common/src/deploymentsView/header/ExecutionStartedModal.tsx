import type { FunctionComponent } from 'react';
import { i18nPrefix } from '../common';
import GoToExecutionsPageButton from './GoToExecutionsPageButton';

interface ExecutionStartedModalProps {
    toolbox: Stage.Types.Toolbox;
    onCancel: () => void;
}

const t = Stage.Utils.getT(`${i18nPrefix}.header.bulkActions.common.executionStartedModal`);

const ExecutionStartedModal: FunctionComponent<ExecutionStartedModalProps> = ({ toolbox, onCancel }) => {
    const { CancelButton, Icon, Modal } = Stage.Basic;

    return (
        <Modal open>
            <Modal.Header>
                <Icon name="rocket" /> {t('header')}
            </Modal.Header>
            <Modal.Content>{t('message')}</Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onCancel} content={t('buttons.close')} />
                <GoToExecutionsPageButton toolbox={toolbox} />
            </Modal.Actions>
        </Modal>
    );
};

export default ExecutionStartedModal;
