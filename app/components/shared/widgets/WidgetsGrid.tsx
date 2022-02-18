// @ts-nocheck File not migrated fully to TS
import React from 'react';

import Grid from '../../layout/Grid';
import GridItem from '../../layout/GridItem';
import Widget, { WidgetOwnProps } from './Widget';

// NOTE: this cannot be a component since `Grid` expects only `GridItem`s as direct components
/**
 * Renders a widget inside a `GridItem`.
 * Useful for rendering widgets inside a grid inside of other widgets
 */
function renderWidgetGridItem<Configuration>(widgetProps: WidgetOwnProps<Configuration>) {
    const { widget } = widgetProps;
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
            <Widget {...widgetProps} />
        </GridItem>
    );
}

/**
 * WidgetsGrid can display regular components and widgets in a single grid
 */
const WidgetsGrid: typeof Grid & {
    renderWidgetGridItem: typeof renderWidgetGridItem;
    Item: typeof GridItem;
} = Grid.bind({}) as any;
WidgetsGrid.renderWidgetGridItem = renderWidgetGridItem;
WidgetsGrid.Item = GridItem;

export default WidgetsGrid;
