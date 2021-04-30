import type { FunctionComponent } from 'react';
import { QueryObserverLoadingResult, QueryObserverSuccessResult, useQuery } from 'react-query';
import styled from 'styled-components';

import { FilterRuleOperators, FilterRuleType } from '../../filters/types';
import { filterRulesContextKey, i18nDrillDownPrefix, subenvironmentsIcon, subservicesIcon } from '../common';
import type { Deployment } from '../types';

export interface DrilldownButtonsProps {
    deploymentId: string;
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    toolbox: Stage.Types.Toolbox;
}

const ButtonsContainer = styled.div`
    margin: 0 1em;
`;

const i18nDrillDownButtonsPrefix = `${i18nDrillDownPrefix}.buttons`;
const getDeploymentUrl = (id: string) => `/deployments/${id}?all_sub_deployments=false`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({ drillDown, deploymentId, toolbox }) => {
    const deploymentDetailsResult = useQuery(
        getDeploymentUrl(deploymentId),
        ({ queryKey: url }): Promise<Deployment> => toolbox.getManager().doGet(url)
    );

    if (deploymentDetailsResult.isIdle || deploymentDetailsResult.isError) {
        const { ErrorMessage } = Stage.Basic;
        return (
            <ErrorMessage
                error={Stage.i18n.t(`${i18nDrillDownButtonsPrefix}.detailsFetchingError`)}
                header=""
                onDismiss={null}
            />
        );
    }

    const subdeploymentResults = getSubdeploymentResults(deploymentDetailsResult);

    return (
        <ButtonsContainer>
            <DrilldownButton
                type="environments"
                drillDown={drillDown}
                deploymentName={deploymentId}
                result={subdeploymentResults.subenvironments}
            />
            <DrilldownButton
                type="services"
                drillDown={drillDown}
                deploymentName={deploymentId}
                result={subdeploymentResults.subservices}
            />
        </ButtonsContainer>
    );
};
export default DrilldownButtons;

const getSubdeploymentResults = (
    deploymentDetailsResult: QueryObserverLoadingResult<Deployment> | QueryObserverSuccessResult<Deployment>
): { subservices: SubdeploymentsResult; subenvironments: SubdeploymentsResult } => {
    if (deploymentDetailsResult.isLoading) {
        return {
            subservices: { loading: true },
            subenvironments: { loading: true }
        };
    }

    return {
        subservices: { loading: false, count: deploymentDetailsResult.data.sub_services_count },
        subenvironments: { loading: false, count: deploymentDetailsResult.data.sub_environments_count }
    };
};

type SubdeploymentsResult = { loading: true } | { loading: false; count: number };

interface DrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: DrilldownButtonsProps['drillDown'];
    deploymentName: string;
    result: SubdeploymentsResult;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const DrilldownButton: FunctionComponent<DrilldownButtonProps> = ({ type, drillDown, deploymentName, result }) => {
    const { i18n } = Stage;
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeRule[type]] },
            `${deploymentName} [${i18n.t(`${i18nDrillDownPrefix}.breadcrumbs.${type}`)}]`
        );
    };

    const { Button, Icon } = Stage.Basic;

    return (
        <Button
            basic
            color="blue"
            onClick={drilldownToSubdeployments}
            disabled={result.loading || result.count === 0}
            loading={result.loading}
            title={i18n.t(`${i18nDrillDownButtonsPrefix}.${type}.title`)}
        >
            <Icon name={icon} />
            {i18n.t(`${i18nDrillDownButtonsPrefix}.${type}.label`)}
            {!result.loading && <> ({result.count})</>}
            {/* TODO(RD-2005): add icons depending on children state */}
        </Button>
    );
};

const deploymentTypeRule: Record<DrilldownButtonProps['type'], Stage.Common.Filters.Rule> = {
    environments: {
        type: FilterRuleType.Label,
        key: 'csys-obj-type',
        operator: FilterRuleOperators.AnyOf,
        values: ['environment']
    },
    services: {
        type: FilterRuleType.Label,
        key: 'csys-obj-type',
        // TODO(RD-2145): use FilterRuleOperators enum after adding the `not_in` member in it
        operator: 'not_in' as any,
        values: ['environment']
    }
};
