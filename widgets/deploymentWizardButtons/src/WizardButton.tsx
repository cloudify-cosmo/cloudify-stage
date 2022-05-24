import type { FunctionComponent } from 'react';
import { ButtonProps, IconProps } from 'semantic-ui-react';
import Wizard from './wizard';

const { Button, Icon } = Stage.Basic;
const { useBoolean } = Stage.Hooks;

interface WizardButtonProps {
    color: ButtonProps['color'];
    icon: IconProps['name'];
    name: string;
    wizardTitle: string;
    // NOTE: Currently the type for steps is being described in Wizard.Modal.StepsPropType
    steps: any[];
    toolbox: Stage.Types.Toolbox;
}

const WizardButton: FunctionComponent<WizardButtonProps> = ({ color, icon, name, steps, toolbox, wizardTitle }) => {
    const [isWizardOpen, openWizard, closeWizard] = useBoolean();

    return (
        <>
            <Button color={color} onClick={openWizard} labelPosition="left" icon className="widgetButton">
                <Icon name={icon} size="large" />
                {name}
            </Button>
            {isWizardOpen && (
                // @ts-ignore Wizard.Modal is not migrated to typescript
                <Wizard.Modal header={wizardTitle} steps={steps} onClose={closeWizard} toolbox={toolbox} />
            )}
        </>
    );
};

export default WizardButton;
