import type { FunctionComponent } from 'react';
import React from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import StageUtils from '../../../utils/stageUtils';
import { ApproveButton, Button, CancelButton, Dropdown, Modal } from '../../../components/basic';

const translate = StageUtils.getT('widgets.common.deployments.deployModal');

export enum Buttons {
    install,
    deploy
}
interface ApproveButtonsProps {
    loading: boolean;
    showDeployButton: boolean;
    onInstall: () => void;
    onDeploy: () => void;
    selectedApproveButton: Buttons;
    onApproveButtonChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const ApproveButtons: FunctionComponent<ApproveButtonsProps> = ({
    showDeployButton,
    onInstall,
    loading,
    onDeploy,
    selectedApproveButton,
    onApproveButtonChange
}) => {
    if (!showDeployButton) {
        return (
            <ApproveButton
                onClick={onInstall}
                disabled={loading}
                content={translate('buttons.deployAndInstall')}
                icon="cogs"
            />
        );
    }
    return (
        <Button.Group color="blue">
            {selectedApproveButton === Buttons.install ? (
                <ApproveButton
                    onClick={onInstall}
                    disabled={loading}
                    content={translate('buttons.install')}
                    icon="cogs"
                />
            ) : (
                <ApproveButton
                    onClick={onDeploy}
                    disabled={loading}
                    content={translate('buttons.deploy')}
                    icon="rocket"
                />
            )}

            <Dropdown
                className="icon"
                button
                clearable={false}
                disabled={loading}
                floating
                aria-label="Deploy or Install"
                onChange={onApproveButtonChange}
                value={selectedApproveButton}
                options={[
                    {
                        key: 'deploy',
                        icon: 'rocket',
                        text: translate('buttons.deploy'),
                        value: Buttons.deploy
                    },
                    {
                        key: 'install',
                        icon: 'cogs',
                        text: translate('buttons.install'),
                        value: Buttons.install
                    }
                ]}
                trigger={<></>}
            />
        </Button.Group>
    );
};

interface DeployModalActionsProps {
    loading: boolean;
    showDeployButton: boolean;
    onCancel: () => void;
    onInstall: () => void;
    onDeploy: () => void;
    selectedApproveButton: Buttons;
    onApproveButtonChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

const DeployModalActions: FunctionComponent<DeployModalActionsProps> = ({
    loading,
    showDeployButton,
    onCancel,
    onInstall,
    onDeploy,
    selectedApproveButton,
    onApproveButtonChange
}) => {
    return (
        <Modal.Actions>
            <CancelButton onClick={onCancel} disabled={loading} />
            <ApproveButtons
                showDeployButton={showDeployButton}
                onInstall={onInstall}
                loading={loading}
                onDeploy={onDeploy}
                selectedApproveButton={selectedApproveButton}
                onApproveButtonChange={onApproveButtonChange}
            />
        </Modal.Actions>
    );
};

export default DeployModalActions;
