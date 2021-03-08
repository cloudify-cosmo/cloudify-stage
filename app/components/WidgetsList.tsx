/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Widget from './Widget';
import Grid from './layout/Grid';
import GridItem from './layout/GridItem';
import type { SimpleWidgetObj } from '../actions/page';

export interface WidgetsListProps {
    onWidgetUpdated: (widgetId: string, params: Record<string, any>) => void;
    onWidgetRemoved: (widgetId: string) => void;
    isEditMode: boolean;
    widgets: SimpleWidgetObj[];
}

export default function WidgetsList({ onWidgetUpdated, onWidgetRemoved, isEditMode, widgets }: WidgetsListProps) {
    return (
        <Grid
            isEditMode={isEditMode}
            onGridDataChange={onWidgetUpdated}
            style={{ zIndex: _(widgets).filter({ maximized: true }).size() }}
        >
            {widgets.map(widget => {
                const widgetDefId = widget.definition;
                return (
                    <GridItem
                        key={widget.id}
                        id={widget.id}
                        x={widget.x}
                        y={widget.y}
                        height={widget.height}
                        width={widget.width}
                        className={`widget ${widgetDefId}Widget`}
                        maximized={widget.maximized}
                    >
                        <Widget
                            widget={widget}
                            isEditMode={isEditMode}
                            onWidgetUpdated={onWidgetUpdated}
                            onWidgetRemoved={onWidgetRemoved}
                        />
                    </GridItem>
                );
            })}
        </Grid>
    );
}

WidgetsList.propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({})),
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

WidgetsList.defaultProps = {
    widgets: []
};
