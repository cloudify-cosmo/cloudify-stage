import type { FunctionComponent } from 'react';

import type { Deployment } from '../types';
import DetailsPaneHeader from './header';
import DetailsPaneWidgets from './widgets';
import './index.scss';

export interface DetailsPaneProps {
    /**
     * Deployment can be undefined when either:
     * 1. The selected deployment (in the context) is on a different page than
     *    the one displayed in the table
     * 2. There are multiple selected deployments in the context (it is an array)
     * 3. Resource Filter is set to "multiple" mode (even if there is only 1 deployment
     *    selected)
     */
    deployment: Deployment | undefined;
}

const DetailsPane: FunctionComponent<DetailsPaneProps> = ({ deployment }) => {
    if (!deployment) {
        const { Message } = Stage.Basic;

        return (
            <div className="unknownDeploymentMessage">
                <Message warning>
                    <Message.Header>Unknown deployment selected</Message.Header>
                    <p>
                        The selected deployment is either not in the table, or you are using a Resource Filter with
                        multiple selection.
                    </p>
                    <p>Please select a deployment shown in the table on the left.</p>
                </Message>
            </div>
        );
    }

    return (
        <div className="detailsPane">
            <DetailsPaneHeader deploymentName={deployment.id} />
            <DetailsPaneWidgets />
        </div>
    );
};
export default DetailsPane;

DetailsPane.propTypes = {
    // NOTE: `as any` to comply with TypeScript
    deployment: PropTypes.shape({}) as any
};
