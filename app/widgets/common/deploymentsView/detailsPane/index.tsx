import type { FunctionComponent } from 'react';
import React from 'react';

import PropTypes from 'prop-types';
import type { Deployment } from '../types';
import type { DrilldownButtonsProps } from './drilldownButtons';
import DrilldownButtons from './drilldownButtons';
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
    mapOpen: boolean;
}

const DetailsPane: FunctionComponent<DetailsPaneProps> = ({ deployment, widget, toolbox, mapOpen }) => {
    if (!deployment) {
        // NOTE: there is no known selected deployment and there are no other deployments in the table
        // Thus, the table should show "No results found" and the details pane should be empty.
        return null;
    }

    const drillDown: DrilldownButtonsProps['drillDown'] = (templateName, drilldownContext, drilldownPageName) =>
        toolbox.drillDown(widget, templateName, drilldownContext, drilldownPageName);

    return (
        <div className="detailsPane">
            <DetailsPaneHeader
                deployment={deployment}
                drilldownButtons={
                    <DrilldownButtons
                        deployment={deployment}
                        drillDown={drillDown}
                        toolbox={toolbox}
                        refetchInterval={widget.configuration.customPollingTime * 1000}
                        mapOpen={mapOpen}
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
