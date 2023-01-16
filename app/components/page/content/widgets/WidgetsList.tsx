import PropTypes from 'prop-types';
import _ from 'lodash';
import React from 'react';
import Grid from './grid/Grid';
import type { SimpleWidgetObj } from '../../../../actions/page';
import type { WidgetOwnProps } from './Widget';
import WidgetsGrid from './WidgetsGrid';

export type WidgetsListProps = Pick<WidgetOwnProps<any>, 'onWidgetRemoved' | 'onWidgetUpdated' | 'isEditMode'> & {
    widgets: SimpleWidgetObj[];
};

export default function WidgetsList({ onWidgetUpdated, onWidgetRemoved, isEditMode, widgets }: WidgetsListProps) {
    return (
        <Grid
            isEditMode={isEditMode}
            onGridDataChange={
                onWidgetUpdated ??
                (() => {
                    throw new Error('onWidgetUpdated must be provided in edit mode');
                })
            }
            style={{ zIndex: _(widgets).filter({ maximized: true }).size() }}
        >
            {widgets.map(widget =>
                WidgetsGrid.renderWidgetGridItem({
                    isEditMode,
                    onWidgetRemoved,
                    onWidgetUpdated,
                    widget
                })
            )}
        </Grid>
    );
}

WidgetsList.propTypes = {
    widgets: PropTypes.arrayOf(PropTypes.shape({})),
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func,
    isEditMode: PropTypes.bool.isRequired
};

WidgetsList.defaultProps = {
    widgets: []
};
