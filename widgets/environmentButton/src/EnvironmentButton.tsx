import type { FunctionComponent } from 'react';
import type { Toolbox } from 'app/utils/StageAPI';
import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';

const translateMenu = Stage.Utils.getT('widgets.environmentButton.menu');

interface EnvironmentButtonProps {
    toolbox: Toolbox;
    configuration: ButtonConfiguration;
}

const EnvironmentButton: FunctionComponent<EnvironmentButtonProps> = ({ configuration, toolbox }) => {
    const { useBoolean } = Stage.Hooks;
    const [fromBlueprintModalOpen, openFromBlueprintModal, closeFromBlueprintModal] = useBoolean();

    const { Dropdown, Button, Icon } = Stage.Basic;
    const { DeployBlueprintModal } = Stage.Common;
    const { FilterRuleType, FilterRuleOperators } = Stage.Common.Filters;
    return (
        <>
            <Dropdown
                fluid
                icon={null}
                trigger={
                    <Button fluid color={configuration.color} basic={configuration.basic} icon labelPosition="left">
                        {configuration.label}
                        <Icon name={configuration.icon} />
                        <span>
                            <Icon name="dropdown" style={{ float: 'right' }} />
                        </span>
                    </Button>
                }
            >
                <Dropdown.Menu style={{ width: '100%' }}>
                    <Dropdown.Item disabled>{translateMenu('new')}</Dropdown.Item>
                    <Dropdown.Item onClick={openFromBlueprintModal}>{translateMenu('fromBlueprint')}</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <DeployBlueprintModal
                open={fromBlueprintModalOpen}
                onHide={closeFromBlueprintModal}
                toolbox={toolbox}
                blueprintFilterRules={[
                    {
                        operator: FilterRuleOperators.AnyOf,
                        type: FilterRuleType.Label,
                        key: 'csys-obj-type',
                        values: ['environment']
                    }
                ]}
            />
        </>
    );
};

export default EnvironmentButton;
