import type { ReactNode } from 'react';
import React from 'react';
import type { SegmentGroupProps, SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import { noop } from 'lodash';
import { Icon, Popup, Segment } from '../../../components/basic';

export interface GroupState {
    name: string;
    colorSUI: SemanticCOLORS;
    icon: SemanticICONS;
}

interface GroupStateProps {
    /**
     * Details of the state including name, icon and color
     */
    state: GroupState;
    className: string;
    /**
     * Description of the state
     */
    description: ReactNode;
    /**
     * Action to be executed on click event
     */
    onClick?: SegmentGroupProps['onClick'];
    /**
     * Number of members in the group
     */
    value?: number;
}

export default function GroupState({ state, className, description, onClick = noop, value = 0 }: GroupStateProps) {
    const disabled = value === 0;
    const color = disabled ? 'grey' : state.colorSUI;

    return (
        <Popup
            header={_.capitalize(state.name)}
            content={description}
            trigger={
                <Segment.Group className={className} disabled={disabled} onClick={onClick}>
                    <Segment color={color} disabled={disabled} inverted textAlign="center">
                        <Icon fitted name={state.icon} />
                    </Segment>
                    <Segment color={color} disabled={disabled} tertiary inverted textAlign="center">
                        {value}
                    </Segment>
                </Segment.Group>
            }
        />
    );
}
