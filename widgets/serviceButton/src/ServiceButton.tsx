import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import { FunctionComponent } from 'react';

export interface ServiceButtonProps {
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    marketplaceTabs: Stage.Common.BlueprintMarketplace.Tab[];
}

const ServiceButton: FunctionComponent<ServiceButtonProps> = ({ color, icon, label, marketplaceTabs = [] }) => {
    const { useBoolean } = Stage.Hooks;
    const [open, setOpen, unsetOpen] = useBoolean();

    const { Button } = Stage.Basic;
    const { Modal } = Stage.Common.BlueprintMarketplace;

    return (
        <div>
            <Button basic color={color} icon={icon} content={label} labelPosition="left" onClick={setOpen} />

            {open && <Modal open onHide={unsetOpen} tabs={marketplaceTabs} />}
        </div>
    );
};

export default ServiceButton;
