import { noop } from 'lodash';
import { ComponentProps, FunctionComponent, ReactNode, useMemo, useRef } from 'react';

import './header.scss';
import { Deployment } from '../types';

export interface DetailsPaneHeaderProps {
    deployment: Deployment;
    drilldownButtons: ReactNode;
}

const DetailsPaneHeader: FunctionComponent<DetailsPaneHeaderProps> = ({ deployment, drilldownButtons }) => {
    const { id, display_name: displayName } = deployment;
    const { Header } = Stage.Basic;
    const { Widget } = Stage.Shared.Widgets;
    const uuidRef = useRef(Stage.Utils.uuid);
    const deploymentActionButtonsWidgetDescription = useMemo(
        (): ComponentProps<typeof Widget>['widget'] => ({
            id: `${uuidRef.current}-${id}`,
            name: 'Deployment Action Buttons',
            // NOTE: arbitrary position, as it is not used
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            definition: 'deploymentActionButtons',
            configuration: { preventRedirectToParentPageAfterDelete: true },
            drillDownPages: {},
            maximized: false
        }),
        [id]
    );

    return (
        <div className="detailsPaneHeader">
            <div style={{ marginRight: '1rem', marginBottom: '1rem' }}>
                <Header>{displayName}</Header>
            </div>
            {drilldownButtons}
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
