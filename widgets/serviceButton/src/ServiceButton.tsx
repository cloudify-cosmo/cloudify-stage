import type { FunctionComponent } from 'react';
import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';

const { Button } = Stage.Basic;
const { drilldownPage } = Stage.Common.Consts;

export interface ServiceButtonProps extends ButtonConfiguration {
    defaultMarketplaceTab?: string;
    toolbox: Stage.Types.Toolbox;
}

const ServiceButton: FunctionComponent<ServiceButtonProps> = ({
    basic,
    color,
    icon,
    label,
    defaultMarketplaceTab,
    toolbox
}) => {
    const handleClick = () => {
        const widget = toolbox.getWidget();
        toolbox.drillDown(widget, drilldownPage.blueprintMarketplace, {
            defaultTab: defaultMarketplaceTab
        });
    };

    return (
        <Button
            basic={basic}
            color={color || undefined}
            content={label}
            icon={icon || undefined}
            fluid
            labelPosition={icon ? 'left' : undefined}
            onClick={handleClick}
        />
    );
};

export default ServiceButton;
