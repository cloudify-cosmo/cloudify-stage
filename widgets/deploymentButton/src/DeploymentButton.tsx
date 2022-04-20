import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { FunctionComponent } from 'react';

interface Props {
    toolbox: Stage.Types.Toolbox;
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
}
const DeploymentButtonWrapper: FunctionComponent<Props> = ({ basic, color, icon, label, toolbox }) => {
    const { Button } = Stage.Basic;
    const { DeployBlueprintModal } = Stage.Common;
    const { useBoolean } = Stage.Hooks;
    const [isModalOpen, showModal, hideModal] = useBoolean(false);

    return (
        <div>
            <Button
                basic={basic}
                color={color}
                icon={icon}
                content={label}
                labelPosition="left"
                className="widgetButton"
                onClick={showModal}
            />
            <DeployBlueprintModal open={isModalOpen} onHide={hideModal} toolbox={toolbox} />
        </div>
    );
};

export default DeploymentButtonWrapper;
