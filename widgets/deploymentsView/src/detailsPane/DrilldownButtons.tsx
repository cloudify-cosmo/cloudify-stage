import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { i18nPrefix, subenvironmentsIcon, subservicesIcon } from '../common';
import type { Deployment } from '../types';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const ButtonsContainer = styled.div`
    margin: 0 1em;
`;

const i18nDrillDownPrefix = `${i18nPrefix}.drillDown`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({ drillDown, deployment }) => {
    const { Button, Icon } = Stage.Basic;
    const { i18n } = Stage;
    const {
        id: deploymentName,
        // TODO(RD-2003): fetch the number of only the immediate children
        sub_services_count: subservicesCount,
        sub_environments_count: subenvironmentsCount
    } = deployment;

    const drilldownToSubenvironments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            // TODO(RD-2004): add filter rules in context to only show environments
            {},
            `${deploymentName} [${i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.environments`)}]`
        );
    };
    const drilldownToSubservices = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            // TODO(RD-2004): add filter rules in context to only show services
            {},
            `${deploymentName} [${i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.services`)}]`
        );
    };

    return (
        <ButtonsContainer>
            <Button
                basic
                color="blue"
                onClick={drilldownToSubenvironments}
                disabled={subenvironmentsCount === 0}
                title={i18n.t(`${i18nDrillDownPrefix}.buttons.subenvironments.title`)}
            >
                <Icon name={subenvironmentsIcon} />
                {i18n.t(`${i18nDrillDownPrefix}.buttons.subenvironments.label`)} ({subenvironmentsCount})
                {/* TODO(RD-2005): add icons depending on children state */}
            </Button>
            <Button
                basic
                color="blue"
                onClick={drilldownToSubservices}
                disabled={subservicesCount === 0}
                title={i18n.t(`${i18nDrillDownPrefix}.buttons.subservices.title`)}
            >
                <Icon name={subservicesIcon} />
                {i18n.t(`${i18nDrillDownPrefix}.buttons.subservices.label`)} ({subservicesCount})
                {/* TODO(RD-2005): add icons depending on children state */}
            </Button>
        </ButtonsContainer>
    );
};
export default DrilldownButtons;
