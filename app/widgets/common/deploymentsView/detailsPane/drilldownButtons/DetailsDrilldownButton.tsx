import type { FunctionComponent } from 'react';
import React from 'react';
import { Icon } from '../../../../../components/basic';
import type { Deployment } from '../../types';
import { tDrillDownButtons } from './common';
import DrilldownButton from './DrilldownButton';
import type { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';
import StageUtils from '../../../../../utils/stageUtils';

interface DetailsDrilldownButtonProps {
    drillDown: SubdeploymentDrilldownButtonProps['drillDown'];
    deployment: Pick<Deployment, 'id' | 'display_name'>;
}

const deploymentDetailsPageTemplateName = 'deployment';
const tDetailsButton = StageUtils.composeT(tDrillDownButtons, 'details');

const DetailsDrilldownButton: FunctionComponent<DetailsDrilldownButtonProps> = ({ drillDown, deployment }) => (
    <DrilldownButton
        onClick={() =>
            drillDown(deploymentDetailsPageTemplateName, { deploymentId: deployment.id }, deployment.display_name)
        }
        title={tDetailsButton('title')}
    >
        {tDetailsButton('label')}
        <Icon name="angle right" />
    </DrilldownButton>
);
export default DetailsDrilldownButton;
