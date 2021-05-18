import type { FunctionComponent } from 'react';

import type { Deployment } from '../types';
import DrilldownButtons, { DrilldownButtonsProps } from './DrilldownButtons';
import DetailsPaneHeader from './header';
import DetailsPaneWidgets from './widgets';
import type { SharedDeploymentsViewWidgetConfiguration } from '../configuration';

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
    toolbox: Stage.Types.Toolbox;
    widget: Stage.Types.Widget<SharedDeploymentsViewWidgetConfiguration>;
}

const DetailsPane: FunctionComponent<DetailsPaneProps> = ({ deployment, widget, toolbox }) => {
    if (!deployment) {
        const { Message } = Stage.Basic;

        return (
            // NOTE: 48px to align with the table
            <div style={{ margin: '48px 10px 0' }}>
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

    const drillDown: DrilldownButtonsProps['drillDown'] = (templateName, drilldownContext, drilldownPageName) =>
        toolbox.drillDown(widget, templateName, drilldownContext, drilldownPageName);

    return (
        <div className="detailsPane">
            <DetailsPaneHeader
                deploymentName={deployment.id}
                drilldownButtons={
                    <DrilldownButtons
                        deploymentId={deployment.id}
                        drillDown={drillDown}
                        toolbox={toolbox}
                        refetchInterval={widget.configuration.customPollingTime * 1000}
                    />
                }
            />
            <DetailsPaneWidgets />
        </div>
    );
};
export default DetailsPane;

DetailsPane.propTypes = {
    // NOTE: `as any` to comply with TypeScript
    deployment: PropTypes.shape({}) as any
};
