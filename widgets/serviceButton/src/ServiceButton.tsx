import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { FunctionComponent } from 'react';
import { push } from 'connected-react-router';

export interface ServiceButtonProps {
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
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
    const { Button } = Stage.Basic;
    const dispatch = ReactRedux.useDispatch();

    const handleClick = () => {
        if (defaultMarketplaceTab) {
            toolbox.getWidget();
            // TODO Norbert: Share blueprintMarketplace page name between this and FirstUserJourneyButtons components
            // toolbox.drillDown(widget, 'blueprintMarketplace', {
            //     defaultTab: defaultMarketplaceTab
            // });
            dispatch(push('/page/console_blueprint_marketplace?defaultTab=Docker'));
        }
    };

    return (
        <div>
            <Button
                basic={basic}
                color={color || undefined}
                content={label}
                icon={icon || undefined}
                fluid
                labelPosition={icon ? 'left' : undefined}
                onClick={handleClick}
            />
        </div>
    );
};

export default ServiceButton;
