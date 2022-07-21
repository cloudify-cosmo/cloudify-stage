import { noop } from 'lodash';
import type { FunctionComponent, ReactNode, ComponentProps } from 'react';
import { useMemo, useRef } from 'react';

import './header.scss';
import styled from 'styled-components';
import type { Deployment } from '../types';

const HeaderWrapper = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;

    // NOTE: adds a gap between the tabs headers when the items in the header wrap
    margin-bottom: 10px;
`;

export interface DetailsPaneHeaderProps {
    deployment: Deployment;
    drilldownButtons: ReactNode;
}

const DetailsPaneHeader: FunctionComponent<DetailsPaneHeaderProps> = ({ deployment, drilldownButtons }) => {
    const { id, display_name: displayName } = deployment;
    const { Header } = Stage.Basic;
    const { TextEllipsis } = Stage.Shared;
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
            configuration: { pollingTime: 5, preventRedirectToParentPageAfterDelete: true },
            drillDownPages: {},
            maximized: false
        }),
        [id]
    );

    return (
        <HeaderWrapper>
            <div style={{ marginRight: '1rem', marginBottom: '1rem' }}>
                <Header>
                    <TextEllipsis maxWidth="300px">{displayName}</TextEllipsis>
                </Header>
            </div>
            {drilldownButtons}
            <Widget
                widget={deploymentActionButtonsWidgetDescription}
                isEditMode={false}
                onWidgetRemoved={noop}
                onWidgetUpdated={noop}
                standalone
            />
        </HeaderWrapper>
    );
};
export default DetailsPaneHeader;
