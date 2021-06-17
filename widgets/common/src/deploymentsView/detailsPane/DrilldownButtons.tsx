import type { FunctionComponent } from 'react';
import { QueryObserverLoadingResult, QueryObserverSuccessResult, useQuery } from 'react-query';
import styled from 'styled-components';

import { FilterRuleOperators, FilterRuleType } from '../../filters/types';
import {
    filterRulesContextKey,
    i18nDrillDownPrefix,
    mapOpenContextKey,
    subenvironmentsIcon,
    subservicesIcon
} from '../common';
import { SubdeploymentStatusIcon } from '../StatusIcon';
import type { Deployment, DeploymentStatus } from '../types';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: (templateName: string, drilldownContext: Record<string, any>, drilldownPageName: string) => void;
    toolbox: Stage.Types.Toolbox;
    refetchInterval: number;
    mapOpen: boolean;
}

const ButtonsContainer = styled.div`
    margin-right: 1rem;
    margin-bottom: 1rem;
    position: relative;
`;

const i18nDrillDownButtonsPrefix = `${i18nDrillDownPrefix}.buttons`;
const getDeploymentUrl = (id: string) => `/deployments/${id}?all_sub_deployments=false`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({
    drillDown,
    deployment,
    toolbox,
    refetchInterval,
    mapOpen
}) => {
    const { id, display_name: displayName } = deployment;

    const deploymentDetailsResult = useQuery(
        getDeploymentUrl(id),
        ({ queryKey: url }): Promise<Deployment> => toolbox.getManager().doGet(url),
        { refetchInterval }
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
    const { LoadingOverlay } = Stage.Basic;

    return (
        <ButtonsContainer>
            {/* NOTE: Show a spinner only when refetching. During the initial fetch there are spinners inside the buttons. */}
            {deploymentDetailsResult.isFetching && !deploymentDetailsResult.isLoading && <LoadingOverlay />}

            <DrilldownButton
                type="environments"
                drillDown={drillDown}
                deploymentName={displayName}
                result={subdeploymentResults.subenvironments}
                mapOpen={mapOpen}
            />
            <DrilldownButton
                type="services"
                drillDown={drillDown}
                deploymentName={displayName}
                result={subdeploymentResults.subservices}
                mapOpen={mapOpen}
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

    const {
        /* eslint-disable camelcase */
        sub_environments_count,
        sub_environments_status,
        sub_services_count,
        sub_services_status
        /* eslint-enable camelcase */
    } = deploymentDetailsResult.data;

    return {
        subservices: { loading: false, count: sub_services_count, status: sub_services_status },
        subenvironments: { loading: false, count: sub_environments_count, status: sub_environments_status }
    };
};

type SubdeploymentsResult = { loading: true } | { loading: false; count: number; status: DeploymentStatus | null };

interface DrilldownButtonProps {
    type: 'environments' | 'services';
    drillDown: DrilldownButtonsProps['drillDown'];
    deploymentName: string;
    result: SubdeploymentsResult;
    mapOpen: boolean;
}

const subdeploymentsDrilldownTemplateName = 'drilldownDeployments';

const DrilldownButton: FunctionComponent<DrilldownButtonProps> = ({
    type,
    drillDown,
    deploymentName,
    result,
    mapOpen
}) => {
    const { i18n } = Stage;
    const icon = type === 'services' ? subservicesIcon : subenvironmentsIcon;

    const drilldownToSubdeployments = () => {
        drillDown(
            subdeploymentsDrilldownTemplateName,
            { [filterRulesContextKey]: [deploymentTypeRule[type]], [mapOpenContextKey]: mapOpen },
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
            {!result.loading && (
                <>
                    {' '}
                    ({result.count}) <SubdeploymentStatusIcon status={result.status} />
                </>
            )}
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
        operator: FilterRuleOperators.IsNot,
        values: ['environment']
    }
};
