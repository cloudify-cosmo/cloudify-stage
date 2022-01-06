import { FunctionComponent, useState } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface ApproveButtonsProps {
    loading: boolean;
    showDeployButton: boolean;
    showInstallModal: () => void;
    onDeploy: () => void;
}

const ApproveButtons: FunctionComponent<ApproveButtonsProps> = ({
    showDeployButton,
    showInstallModal,
    loading,
    onDeploy
}) => {
    const BUTTONS = { install: 0, deploy: 1 };
    const [selectedButton, setSelectedButton] = useState(BUTTONS.install);
    const { ApproveButton, Button, Dropdown } = Stage.Basic;
    if (!showDeployButton) {
        <ApproveButton
            onClick={showInstallModal}
            disabled={loading}
            content={t('buttons.deployAndInstall')}
            icon="cogs"
            className="green"
        />;
    }
    return (
        <Button.Group color="green">
            {selectedButton === BUTTONS.install ? (
                <ApproveButton
                    onClick={showInstallModal}
                    disabled={loading}
                    content={t('buttons.install')}
                    icon="cogs"
                />
            ) : (
                <ApproveButton onClick={onDeploy} disabled={loading} content={t('buttons.deploy')} icon="rocket" />
            )}

            <Dropdown
                className="button icon down"
                clearable={false}
                floating
                options={[
                    {
                        key: 'deploy',
                        icon: 'rocket',
                        text: t('buttons.deploy'),
                        value: 'Deploy',
                        onClick: () => setSelectedButton(BUTTONS.deploy)
                    },
                    {
                        key: 'install',
                        icon: 'cogs',
                        text: t('buttons.install'),
                        value: 'Install',
                        onClick: () => setSelectedButton(BUTTONS.install)
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
    showInstallModal: () => void;
    onDeploy: () => void;
}

const DeployModalActions: FunctionComponent<DeployModalActionsProps> = ({
    loading,
    showDeployButton,
    onCancel,
    showInstallModal,
    onDeploy
}) => {
    const { Modal, CancelButton } = Stage.Basic;
    return (
        <Modal.Actions>
            <CancelButton onClick={onCancel} disabled={loading} />
            <ApproveButtons {...{ showDeployButton, showInstallModal, loading, onDeploy }} />
        </Modal.Actions>
    );
};

export default DeployModalActions;
