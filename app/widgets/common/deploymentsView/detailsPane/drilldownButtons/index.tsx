import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

import type { Deployment } from '../../types';
import { shouldDisplaySubdeploymentButton, tDrillDownButtons } from './common';
import DetailsDrilldownButton from './DetailsDrilldownButton';
import ParentButton from './ParentButton';
import type { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';
import SubdeploymentDrilldownButton from './SubdeploymentDrilldownButton';
import { getSubdeploymentResults, useSubdeploymentInfo } from './subdeployments-result';
import { ErrorMessage, LoadingOverlay } from '../../../../../components/basic';

export interface DrilldownButtonsProps {
    deployment: Pick<Deployment, 'id' | 'display_name'>;
    drillDown: SubdeploymentDrilldownButtonProps['drillDown'];
    toolbox: Stage.Types.Toolbox;
    refetchInterval: number;
    mapOpen: boolean;
}

const ButtonsContainer = styled.div`
    margin-right: auto;
    margin-bottom: 1rem;
`;

const SubdeploymentButtonsContainer = styled.div`
    position: relative;
    // NOTE: make sure the 2 buttons appear as a single block. This way the LoadingOverlay will be a rectangle
    // and not wrap over 2 lines.
    display: inline-block;
`;

const DrilldownButtons: FunctionComponent<DrilldownButtonsProps> = ({
    drillDown,
    deployment,
    toolbox,
    refetchInterval,
    mapOpen
}) => {
    const { id, display_name: displayName } = deployment;

    const subdeploymentInfoResult = useSubdeploymentInfo(id, toolbox, refetchInterval);

    if (subdeploymentInfoResult.isIdle || subdeploymentInfoResult.isError) {
        return <ErrorMessage error={tDrillDownButtons('detailsFetchingError')} header="" />;
    }

    const subdeploymentResults = getSubdeploymentResults(subdeploymentInfoResult);

    const shouldCenterButtons =
        shouldDisplaySubdeploymentButton(subdeploymentResults.subenvironments) ||
        shouldDisplaySubdeploymentButton(subdeploymentResults.subservices);

    return (
        <ButtonsContainer className={shouldCenterButtons ? 'centeredButtons' : ''}>
            <ParentButton toolbox={toolbox} />

            <DetailsDrilldownButton deployment={deployment} drillDown={drillDown} />

            <SubdeploymentButtonsContainer>
                {/* NOTE: Show a spinner only when refetching. During the initial fetch there are spinners inside the buttons. */}
                {subdeploymentInfoResult.isFetching && !subdeploymentInfoResult.isLoading && <LoadingOverlay />}

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
