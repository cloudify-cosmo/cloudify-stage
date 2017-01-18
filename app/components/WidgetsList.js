/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

import Widget from '../containers/Widget';
import Grid from './layout/Grid';
import GridItem from './layout/GridItem';

export default class WidgetsList extends Component {
    static isEditMode = false;

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widgets: PropTypes.array.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    _updateWidget (widgetId,data) {
        this.props.onWidgetsGridDataChange(this.props.pageId,widgetId,data);
    }

    render() {
        return (
        <Grid isEditMode={this.props.isEditMode} onGridDataChange={this._updateWidget.bind(this)}>
            {
                this.props.widgets.map(function(widget){
                    return (
                        <GridItem
                            key={widget.id}
                            id={widget.id}
                            x={widget.x} y={widget.y}
                            height={widget.height}
                            width={widget.width}
                            zIndex={widget.definition ? widget.definition.zIndex : undefined}
                            className='widget'>
                            <Widget widget={widget} pageId={this.props.pageId}></Widget>
                        </GridItem>
                        )
                },this)
            }
        </Grid>
        );
    }
}

