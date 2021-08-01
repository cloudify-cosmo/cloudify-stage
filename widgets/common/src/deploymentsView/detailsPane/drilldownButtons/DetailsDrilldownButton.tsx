import type { FunctionComponent } from 'react';

import type { Deployment } from '../../types';
import { tDrillDownButtons } from './common';
import DrilldownButton from './DrilldownButton';
import type { SubdeploymentDrilldownButtonProps } from './SubdeploymentDrilldownButton';

interface DetailsDrilldownButtonProps {
    drillDown: SubdeploymentDrilldownButtonProps['drillDown'];
    deployment: Pick<Deployment, 'id' | 'display_name'>;
}

const deploymentDetailsPageTemplateName = 'deployment';
const tDetailsButton = Stage.Utils.composeT(tDrillDownButtons, 'details');

const DetailsDrilldownButton: FunctionComponent<DetailsDrilldownButtonProps> = ({ drillDown, deployment }) => (
    <DrilldownButton
        onClick={() =>
            drillDown(deploymentDetailsPageTemplateName, { deploymentId: deployment.id }, deployment.display_name)
        }
        title={tDetailsButton('title')}
    >
        {tDetailsButton('label')}
        <Stage.Basic.Icon name="angle right" />
    </DrilldownButton>
);
export default DetailsDrilldownButton;
