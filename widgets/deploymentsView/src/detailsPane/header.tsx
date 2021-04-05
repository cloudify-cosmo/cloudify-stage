import { noop } from 'lodash';
import { ComponentProps, FunctionComponent, useMemo, useRef } from 'react';

import './header.scss';

export interface DetailsPaneHeaderProps {
    deploymentName: string;
}

const DetailsPaneHeader: FunctionComponent<DetailsPaneHeaderProps> = ({ deploymentName }) => {
    const { Header } = Stage.Basic;
    const { Widget } = Stage.Shared.Widgets;
    const uuidRef = useRef(Stage.Utils.uuid);
    const deploymentActionButtonsWidgetDescription = useMemo(
        (): ComponentProps<typeof Widget>['widget'] => ({
            id: `${uuidRef.current}-${deploymentName}`,
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
        }),
        [deploymentName]
    );

    return (
        <div className="detailsPaneHeader">
            <Header>{deploymentName}</Header>
            <Widget
                widget={deploymentActionButtonsWidgetDescription}
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
