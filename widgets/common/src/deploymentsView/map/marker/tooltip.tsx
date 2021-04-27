import { camelCase } from 'lodash';
import type { FunctionComponent } from 'react';

import type { Deployment } from '../../types';
import { mapT } from '../common';
import { DeploymentStatusIcon } from '../../StatusIcon';

const tooltipStatusT = (suffix: string) => mapT(`tooltip.status.${suffix}`);
const markerIconHeight = 41;
const tooltipOffset = L.point(0, -markerIconHeight);

const DeploymentSiteTooltip: FunctionComponent<{ deployment: Deployment; environmentTypeVisible: boolean }> = ({
    deployment,
    environmentTypeVisible
}) => {
    const {
        Leaflet: { Tooltip },
        Header
    } = Stage.Basic;

    return (
        <Tooltip direction="top" offset={tooltipOffset}>
            <Header as="h4">{deployment.id}</Header>
            <div>{deployment.blueprint_id}</div>
            <div>{deployment.site_name}</div>
            {environmentTypeVisible && <div>{deployment.environment_type}</div>}
            <div>
                <DeploymentStatusIcon status={deployment.deployment_status} />
                {tooltipStatusT(camelCase(deployment.deployment_status))}
            </div>
        </Tooltip>
    );
};
export default DeploymentSiteTooltip;
