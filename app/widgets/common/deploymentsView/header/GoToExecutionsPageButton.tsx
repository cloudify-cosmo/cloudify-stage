import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import { i18nPrefix } from '../common';
import { ApproveButton } from '../../../../components/basic';

interface GoToExecutionsPageButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const GoToExecutionsPageButton: FunctionComponent<GoToExecutionsPageButtonProps> = ({ toolbox }) => {
    return (
        <ApproveButton
            onClick={() => toolbox.goToPage('executions', null)}
            content={i18n.t(`${i18nPrefix}.header.bulkActions.common.executionStartedModal.buttons.goToExecutionsPage`)}
        />
    );
};
export default GoToExecutionsPageButton;
