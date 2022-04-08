import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { FunctionComponent } from 'react';
import type { MarketplaceTab } from '../../common/src/blueprintMarketplace/types';

export interface ServiceButtonProps {
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    marketplaceTabs: MarketplaceTab[];
}

const ServiceButton: FunctionComponent<ServiceButtonProps> = ({ basic, color, icon, label, marketplaceTabs = [] }) => {
    const { useBoolean } = Stage.Hooks;
    const [open, setOpen, unsetOpen] = useBoolean();

    const { Button } = Stage.Basic;
    const { Modal } = Stage.Common.BlueprintMarketplace;

    return (
        <div>
            <Button
                basic={basic}
                color={color || undefined}
                content={label}
                icon={icon || undefined}
                fluid
                labelPosition={icon ? 'left' : undefined}
                onClick={setOpen}
            />

            {open && <Modal open onHide={unsetOpen} tabs={marketplaceTabs} />}
        </div>
    );
};

export default ServiceButton;
