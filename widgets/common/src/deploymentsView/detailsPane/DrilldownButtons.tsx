import type { FunctionComponent } from 'react';
import styled from 'styled-components';

import { filterRulesContextKey, i18nDrillDownPrefix, subenvironmentsIcon, subservicesIcon } from '../common';
import type { Deployment } from '../types';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
}

const ButtonsContainer = styled.div`
    margin: 0 1em;
`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({ drillDown, deployment }) => {
    const {
        id: deploymentName,
        // TODO(RD-2003): fetch the number of only the immediate children
        sub_services_count: subservicesCount,
        sub_environments_count: subenvironmentsCount
    } = deployment;

    return (
        <ButtonsContainer>
            <DrilldownButton
                type="environments"
                subdeploymentsCount={subenvironmentsCount}
                drillDown={drillDown}
                deploymentName={deploymentName}
            />
            <DrilldownButton
                type="services"
                subdeploymentsCount={subservicesCount}
                drillDown={drillDown}
                deploymentName={deploymentName}
            />
        </ButtonsContainer>
    );
};
export default DrilldownButtons;

interface DrilldownButtonProps {
    subdeploymentsCount: number;
    type: 'environments' | 'services';
    drillDown: DrilldownButtonsProps['drillDown'];
    deploymentName: string;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const DrilldownButton: FunctionComponent<DrilldownButtonProps> = ({
    subdeploymentsCount,
    type,
    drillDown,
    deploymentName
}) => {
    const { Button, Icon } = Stage.Basic;
    const { i18n } = Stage;
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;

    const drilldownToSubdeployments = () => {
        const deploymentTypeRule: Stage.Common.Filters.Rule = {
            // NOTE: cannot use enums as they are not exported
            type: 'label' as any,
            key: 'csys-obj-type',
            operator: 'any_of' as any,
            values: [type === 'services' ? 'service' : 'environment']
        };

        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeRule] },
            `${deploymentName} [${i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.${type}`)}]`
        );
    };

    return (
        <Button
            basic
            color="blue"
            onClick={drilldownToSubdeployments}
            disabled={subdeploymentsCount === 0}
            title={i18n.t(`${i18nDrillDownPrefix}.buttons.${type}.title`)}
        >
            <Icon name={icon} />
            {i18n.t(`${i18nDrillDownPrefix}.buttons.${type}.label`)} ({subdeploymentsCount})
            {/* TODO(RD-2005): add icons depending on children state */}
        </Button>
    );
};
