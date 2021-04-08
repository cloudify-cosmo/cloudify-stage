import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { subenvironmentsIcon, subservicesIcon } from '../common';
import type { Deployment } from '../types';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const ButtonsContainer = styled.div`
    margin: 0 1em;
`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({ drillDown, deployment }) => {
    const { Button, Icon } = Stage.Basic;
    const {
        id: deploymentName,
        // TODO(RD-2003): fetch the number of only the immediate children
        sub_services_count: subservicesCount,
        sub_environments_count: subenvironmentsCount
    } = deployment;

    // TODO: use i18n for all texts

    const drilldownToSubenvironments = () => {
        // TODO(RD-2004): add filter rules in context to only show environments
        drillDown(subdeploymentsDrilldownTemplateName, {}, `${deploymentName} [Environments]`);
    };
    const drilldownToSubservices = () => {
        // TODO(RD-2004): add filter rules in context to only show services
        drillDown(subdeploymentsDrilldownTemplateName, {}, `${deploymentName} [Services]`);
    };

    return (
        <ButtonsContainer>
            <Button
                basic
                color="blue"
                onClick={drilldownToSubenvironments}
                disabled={subenvironmentsCount === 0}
                title="Drill down to subenvironments"
            >
                <Icon name={subenvironmentsIcon} />
                Subenvironments ({subenvironmentsCount}){/* TODO(RD-2005): add icons depending on children state */}
            </Button>
            <Button
                basic
                color="blue"
                onClick={drilldownToSubservices}
                disabled={subservicesCount === 0}
                title="Drill down to subservices"
            >
                <Icon name={subservicesIcon} />
                Services ({subservicesCount}){/* TODO(RD-2005): add icons depending on children state */}
            </Button>
        </ButtonsContainer>
    );
};
export default DrilldownButtons;
