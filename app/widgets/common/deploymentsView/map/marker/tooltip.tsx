import type { FunctionComponent } from 'react';
import React from 'react';
import { camelCase } from 'lodash';
import styled from 'styled-components';

import type { Deployment } from '../../types';
import { tMap } from '../common';
import { DeploymentStatusIcon, SubdeploymentStatusIcon } from '../../StatusIcon';
import { subenvironmentsIcon, subservicesIcon } from '../../common';
import { Header, Icon, Leaflet } from '../../../../../components/basic';

const tooltipStatusT = (suffix: string) => tMap(`tooltip.status.${suffix}`);
const markerIconHeight = 41;
const tooltipOffset = window.L.point(0, -markerIconHeight);

const TooltipContentContainer = styled.div`
    display: flex;
`;

const leafletTooltipPaddingAndBorder = '7px';
const StatusesContainer = styled.div`
    margin-left: 1em;
    padding: calc(1em - ${leafletTooltipPaddingAndBorder});
    padding-left: 1em;
    border-left: 1px solid;
    display: flex;
    flex-direction: column;
    align-items: space-around;
    justify-content: center;
`;
const StatusContainer = styled.div`
    margin: 0.5em 0;
`;

const DeploymentSiteTooltip: FunctionComponent<{ deployment: Deployment; environmentTypeVisible: boolean }> = ({
    deployment,
    environmentTypeVisible
}) => {
    const { Tooltip } = Leaflet;

    return (
        <Tooltip direction="top" offset={tooltipOffset}>
            <TooltipContentContainer>
                <div>
                    <Header as="h4">{deployment.display_name}</Header>
                    <div>{deployment.blueprint_id}</div>
                    <div>{deployment.site_name}</div>
                    {environmentTypeVisible && <div>{deployment.environment_type}</div>}
                    <div>
                        <DeploymentStatusIcon status={deployment.deployment_status} />
                        {tooltipStatusT(camelCase(deployment.deployment_status))}
                    </div>
                </div>
                <StatusesContainer>
                    <StatusContainer>
                        {deployment.sub_environments_count} <Icon name={subenvironmentsIcon} />
                        <SubdeploymentStatusIcon status={deployment.sub_environments_status} />
                    </StatusContainer>
                    <StatusContainer>
                        {deployment.sub_services_count} <Icon name={subservicesIcon} />
                        <SubdeploymentStatusIcon status={deployment.sub_services_status} />
                    </StatusContainer>
                </StatusesContainer>
            </TooltipContentContainer>
        </Tooltip>
    );
};
export default DeploymentSiteTooltip;
