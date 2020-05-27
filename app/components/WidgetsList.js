/**
 * Created by kinneretzin on 01/09/2016.
 */

import PropTypes from 'prop-types';

import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import { useSelector } from 'react-redux';
import Widget from '../containers/Widget';
import Grid from './layout/Grid';
import GridItem from './layout/GridItem';
import stageUtils from '../utils/stageUtils';

export default function WidgetsList({ onWidgetUpdated, onWidgetRemoved, isEditMode, tab, widgets }) {
    const filteredWidgets = useSelector(state => {
        const manager = state.manager || {};

        return widgets.filter(
            widget =>
                widget.definition &&
                stageUtils.isUserAuthorized(widget.definition.permission, manager) &&
                stageUtils.isWidgetPermitted(widget.definition.supportedEditions, manager)
        );
    });

    return _.isEmpty(filteredWidgets) ? (
        <Container className="emptyPage alignCenter">
            {isEditMode ? (
                <Header size="large">
                    This page is empty, <br />
                    don't be shy, give it a meaning!
                </Header>
            ) : (
                <Header size="large">This page is empty</Header>
            )}
        </Container>
    ) : (
        <Grid isEditMode={isEditMode} onGridDataChange={onWidgetUpdated}>
            {filteredWidgets.map(widget => {
                const widgetDefId = (widget.definition || {}).id;
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
                            tab={tab}
                            isEditMode={isEditMode}
                            onWidgetUpdated={onWidgetUpdated}
                            onWidgetRemoved={onWidgetRemoved}
                        />
                    </GridItem>
                );
            }, this)}
        </Grid>
    );
}

WidgetsList.propTypes = {
    tab: PropTypes.number,
    widgets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired
};

WidgetsList.defaultProps = {
    tab: null
};
