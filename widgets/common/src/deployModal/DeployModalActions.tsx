import { FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface ApproveButtonsProps {
    loading: boolean;
    showDeployButton: boolean;
    onInstall: () => void;
    onDeploy: () => void;
    selectedButton: Buttons;
    setSelectedButton: () => void;
}

export enum Buttons {
    install,
    deploy
}

const ApproveButtons: FunctionComponent<ApproveButtonsProps> = ({
    showDeployButton,
    onInstall,
    loading,
    onDeploy,
    selectedButton,
    setSelectedButton
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
            {selectedButton === Buttons.install ? (
                <ApproveButton onClick={onInstall} disabled={loading} content={t('buttons.install')} icon="cogs" />
            ) : (
                <ApproveButton onClick={onDeploy} disabled={loading} content={t('buttons.deploy')} icon="rocket" />
            )}

            <Dropdown
                className="icon"
                button
                clearable={false}
                floating
                aria-label="Deploy or Install"
                onChange={setSelectedButton}
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
    selectedButton: Buttons;
    setSelectedButton: () => void;
}

const DeployModalActions: FunctionComponent<DeployModalActionsProps> = ({
    loading,
    showDeployButton,
    onCancel,
    onInstall,
    onDeploy,
    selectedButton,
    setSelectedButton
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
                selectedButton={selectedButton}
                setSelectedButton={setSelectedButton}
            />
        </Modal.Actions>
    );
};

export default DeployModalActions;
