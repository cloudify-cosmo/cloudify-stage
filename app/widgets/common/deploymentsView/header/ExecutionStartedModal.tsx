import type { FunctionComponent } from 'react';
import React from 'react';
import { i18nPrefix } from '../common';
import GoToExecutionsPageButton from './GoToExecutionsPageButton';
import StageUtils from '../../../../utils/stageUtils';
import { CancelButton, Icon, Modal } from '../../../../components/basic';

interface ExecutionStartedModalProps {
    toolbox: Stage.Types.Toolbox;
    onClose: () => void;
}

const t = StageUtils.getT(`${i18nPrefix}.header.bulkActions.common.executionStartedModal`);

const ExecutionStartedModal: FunctionComponent<ExecutionStartedModalProps> = ({ toolbox, onClose }) => {
    return (
        <Modal open>
            <Modal.Header>
                <Icon name="cogs" /> {t('header')}
            </Modal.Header>
            <Modal.Content>{t('message')}</Modal.Content>
            <Modal.Actions>
                <CancelButton onClick={onClose} content={t('buttons.close')} />
                <GoToExecutionsPageButton toolbox={toolbox} />
            </Modal.Actions>
        </Modal>
    );
};

export default ExecutionStartedModal;
