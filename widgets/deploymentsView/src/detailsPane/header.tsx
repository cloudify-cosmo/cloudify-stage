import { noop } from 'lodash';
import type { FunctionComponent } from 'react';

import './header.scss';

export interface DetailsPaneHeaderProps {
    deploymentName: string;
}

const DetailsPaneHeader: FunctionComponent<DetailsPaneHeaderProps> = ({ deploymentName }) => {
    const { Header } = Stage.Basic;
    const { Widget } = Stage.Shared.Widgets;

    return (
        <div className="detailsPaneHeader">
            <Header>{deploymentName}</Header>
            <Widget
                widget={{
                    id: 'bf9c126b-9bb7-4ec8-827d-f5dbf2c7e938',
                    name: 'Deployment Action Buttons',
                    // NOTE: arbitrary position, as it is not used
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                    definition: 'deploymentActionButtons',
                    configuration: {},
                    drillDownPages: {},
                    maximized: false
                }}
                isEditMode={false}
                onWidgetRemoved={noop}
                onWidgetUpdated={noop}
                standalone
            />
        </div>
    );
};
export default DetailsPaneHeader;

DetailsPaneHeader.propTypes = {
    deploymentName: PropTypes.string.isRequired
};
