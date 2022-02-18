import { FunctionComponent } from 'react';
import { DropdownProps } from 'semantic-ui-react';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

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
    const { ApproveButton, Button, Dropdown } = Stage.Basic;

    if (!showDeployButton) {
        <ApproveButton
            onClick={onInstall}
            disabled={loading}
            content={t('buttons.deployAndInstall')}
            icon="cogs"
            className="green"
        />;
    }
    return (
        <Button.Group color="green">
            {selectedApproveButton === Buttons.install ? (
                <ApproveButton onClick={onInstall} disabled={loading} content={t('buttons.install')} icon="cogs" />
            ) : (
                <ApproveButton onClick={onDeploy} disabled={loading} content={t('buttons.deploy')} icon="rocket" />
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
                        text: t('buttons.deploy'),
                        value: Buttons.deploy
                    },
                    {
                        key: 'install',
                        icon: 'cogs',
                        text: t('buttons.install'),
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
    const { Modal, CancelButton } = Stage.Basic;
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
