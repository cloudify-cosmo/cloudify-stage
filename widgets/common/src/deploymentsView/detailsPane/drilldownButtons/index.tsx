import type { FunctionComponent } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';

import type { Deployment } from '../../types';
import { tDrillDownButtons } from './common';
import DetailsDrilldownButton from './DetailsDrilldownButton';
import SubdeploymentDrilldownButton, { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';
import { getSubdeploymentResults } from './subdeployments-result';

export interface DrilldownButtonsProps {
    deployment: Deployment;
    drillDown: SubdeploymentDrilldownButtonProps['drillDown'];
    toolbox: Stage.Types.Toolbox;
    refetchInterval: number;
    mapOpen: boolean;
}

const ButtonsContainer = styled.div`
    margin-right: 1rem;
    margin-bottom: 1rem;
`;

const SubdeploymentButtonsContainer = styled.div`
    position: relative;
    // NOTE: make sure the 2 buttons appear as a single block. This way the LoadingOverlay will be a rectangle
    // and not wrap over 2 lines.
    display: inline-block;
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
            <DetailsDrilldownButton deployment={deployment} drillDown={drillDown} />

            <SubdeploymentButtonsContainer>
                {/* NOTE: Show a spinner only when refetching. During the initial fetch there are spinners inside the buttons. */}
                {deploymentDetailsResult.isFetching && !deploymentDetailsResult.isLoading && <LoadingOverlay />}

                <SubdeploymentDrilldownButton
                    type="environments"
                    drillDown={drillDown}
                    deploymentName={displayName}
                    result={subdeploymentResults.subenvironments}
                    mapOpen={mapOpen}
                />
                <SubdeploymentDrilldownButton
                    type="services"
                    drillDown={drillDown}
                    deploymentName={displayName}
                    result={subdeploymentResults.subservices}
                    mapOpen={mapOpen}
                />
            </SubdeploymentButtonsContainer>
        </ButtonsContainer>
    );
};
export default DrilldownButtons;
