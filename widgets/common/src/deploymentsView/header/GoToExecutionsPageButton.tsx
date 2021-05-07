import type { FunctionComponent } from 'react';
import { i18nPrefix } from '../common';

interface GoToExecutionsPageButtonProps {
    toolbox: Stage.Types.Toolbox;
}

const GoToExecutionsPageButton: FunctionComponent<GoToExecutionsPageButtonProps> = ({ toolbox }) => {
    const { ApproveButton } = Stage.Basic;

    return (
        <ApproveButton
            onClick={() => toolbox.goToPage('executions', {})}
            color="green"
            content={Stage.i18n.t(`${i18nPrefix}.header.bulkActions.common.goToExecutionsPageButton`)}
        />
    );
};
export default GoToExecutionsPageButton;
