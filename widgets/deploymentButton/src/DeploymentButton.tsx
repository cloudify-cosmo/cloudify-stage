import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { FilterRule } from '../../../app/widgets/common/filters/types';

const { Button } = Stage.Basic;
const { DeployBlueprintModal } = Stage.Common;
const { useBoolean } = Stage.Hooks;

interface DeploymentButtonWrapperProps {
    toolbox: Stage.Types.Toolbox;
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    disabled?: boolean;
    blueprintFilterRules?: FilterRule[];
}

const DeploymentButtonWrapper = ({
    basic,
    color,
    icon,
    label,
    toolbox,
    disabled,
    blueprintFilterRules
}: DeploymentButtonWrapperProps) => {
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
                disabled={disabled}
            />
            <DeployBlueprintModal
                open={isModalOpen}
                onHide={hideModal}
                toolbox={toolbox}
                blueprintFilterRules={blueprintFilterRules}
            />
        </div>
    );
};

export default DeploymentButtonWrapper;
