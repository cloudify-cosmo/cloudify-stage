import type { FunctionComponent } from 'react';
import GenericDeployModal from '../../GenericDeployModal';

interface DeployOnModalProps {
    toolbox: Stage.Types.Toolbox;
    onHide: () => void;
}

const DeployOnModal: FunctionComponent<DeployOnModalProps> = ({ toolbox, onHide }) => {
    return (
        <GenericDeployModal
            toolbox={toolbox}
            open
            onHide={onHide}
            i18nHeaderKey="widgets.deploymentsView.header.bulkActions.deployOn.modal.header"
            deployAndInstallSteps={[{ executeStep: onHide }]}
        />
    );
};

export default DeployOnModal;
