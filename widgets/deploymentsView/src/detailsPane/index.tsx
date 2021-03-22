import type { FunctionComponent } from 'react';

import type { Deployment } from '../types';
import DetailsPaneHeader from './header';

export interface DetailsPaneProps {
    /**
     * Deployment can be undefined when either:
     * 1. The selected deployment (in the context) is on a different page than
     *  the one displayed in the table
     * 2. There are multiple selected deployments in the context (it is an array)
     */
    deployment: Deployment | undefined;
}

const DetailsPane: FunctionComponent<DetailsPaneProps> = ({ deployment }) => {
    if (!deployment) {
        return <div>Unknown deployment selected.</div>;
    }

    return (
        <div>
            <DetailsPaneHeader deploymentName={deployment.id} />
        </div>
    );
};
export default DetailsPane;

DetailsPane.propTypes = {
    // NOTE: `as any` to comply with TypeScript
    deployment: PropTypes.shape({}) as any
};
