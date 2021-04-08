import type { FunctionComponent } from 'react';

import { subenvironmentsIcon, subservicesIcon } from '../common';

export interface DrilldownButtonsProps {
    subservicesCount: number;
    subenvironmentsCount: number;
    toolbox: Stage.Types.Toolbox;
}

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({ subenvironmentsCount, subservicesCount }) => {
    const { Button, Icon } = Stage.Basic;
    return (
        <div>
            {/* TODO: add icons depending on children state */}
            <Button basic color="blue">
                <Icon name={subenvironmentsIcon} />
                Subenvironments ({subenvironmentsCount})
            </Button>
            <Button basic color="blue">
                <Icon name={subservicesIcon} />
                Services ({subservicesCount})
            </Button>
        </div>
    );
};
export default DrilldownButtons;
