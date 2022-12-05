import _ from 'lodash';
import React, { Component } from 'react';

interface GridItemProps {
    id: string;
    className?: string;
    onItemAdded?: (id: string) => void;
    onItemRemoved?: (id: string) => void;
    // NOTE: These props are only used outside, in Grid component
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    maximized?: boolean;
}

export default class GridItem extends Component<GridItemProps> {
    // NOTE: TypeScript need static defaultProps to mark those props as non-optional in `this.props`
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        x: 0,
        y: 0,
        width: 10,
        height: 5
    };

    componentDidMount() {
        const { id, onItemAdded } = this.props;
        if (onItemAdded) {
            onItemAdded(id);
        }
    }

    componentWillUnmount() {
        const { id, onItemRemoved } = this.props;
        if (onItemRemoved) {
            onItemRemoved(id);
        }
    }

    render() {
        const { children, className, id } = this.props;
        return (
            <div id={id} className={className}>
                {children}
            </div>
        );
    }
}
