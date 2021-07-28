import type { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import type { Deployment } from '../../types';
import { tDrillDownButtons } from './common';
import DrilldownButton, { DrilldownButtonProps } from './DrilldownButton';
import { getSubdeploymentResults } from './subdeployments-result';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: DrilldownButtonProps['drillDown'];
    toolbox: Stage.Types.Toolbox;
    refetchInterval: number;
    mapOpen: boolean;
}

const ButtonsContainer = styled.div`
    margin-right: 1rem;
    margin-bottom: 1rem;
    position: relative;
`;

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
        return <ErrorMessage error={tDrillDownButtons('detailsFetchingError')} header="" onDismiss={null} />;
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
