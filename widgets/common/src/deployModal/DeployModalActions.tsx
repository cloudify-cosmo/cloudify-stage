import { FunctionComponent, useState } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.deployModal');

interface ApproveButtonsProps {
    loading: boolean;
    showDeployButton: boolean;
    onInstall: () => void;
    onDeploy: () => void;
}

const ApproveButtons: FunctionComponent<ApproveButtonsProps> = ({ showDeployButton, onInstall, loading, onDeploy }) => {
    enum Buttons {
        install = 0,
        deploy = 1
    }
    const [selectedButton, setSelectedButton] = useState(Buttons.install);
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
                className="button icon down"
                clearable={false}
                floating
                options={[
                    {
                        key: 'deploy',
                        icon: 'rocket',
                        text: t('buttons.deploy'),
                        value: 'Deploy',
                        onClick: () => setSelectedButton(Buttons.deploy)
                    },
                    {
                        key: 'install',
                        icon: 'cogs',
                        text: t('buttons.install'),
                        value: 'Install',
                        onClick: () => setSelectedButton(Buttons.install)
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
}

const DeployModalActions: FunctionComponent<DeployModalActionsProps> = ({
    loading,
    showDeployButton,
    onCancel,
    onInstall,
    onDeploy
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
            />
        </Modal.Actions>
    );
};

export default DeployModalActions;
