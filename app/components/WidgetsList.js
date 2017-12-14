/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import {Container, Header} from 'semantic-ui-react';

import Widget from '../containers/Widget';
import Grid from './layout/Grid';
import GridItem from './layout/GridItem';

export default class WidgetsList extends Component {

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widgets: PropTypes.array.isRequired,
        onWidgetsGridDataChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        pageManagementMode: PropTypes.string
    };

    _updateWidget (widgetId,data) {
        this.props.onWidgetsGridDataChange(this.props.pageId,widgetId,data);
    }

    render() {
        return (
            _.isEmpty(this.props.widgets)
            ?

                <Container className='emptyPage alignCenter'>
                    {
                        this.props.isEditMode
                        ?
                            <Header size='large'>
                                This page is empty, <br/>
                                don't be shy, give it a meaning!
                            </Header>
                        :
                            <Header size='large'>
                                This page is empty
                            </Header>
                    }
                </Container>
            :
                <div>
                    <Grid isEditMode={this.props.isEditMode} onGridDataChange={this._updateWidget.bind(this)}>
                        {
                            this.props.widgets.map(function(widget){
                                var widgetDefId = (widget.definition || {}).id;
                                return (
                                    <GridItem
                                        key={widget.id}
                                        id={widget.id}
                                        x={widget.x} y={widget.y}
                                        height={widget.height}
                                        width={widget.width}
                                        className={`widget ${widgetDefId}Widget`}
                                        maximized={widget.maximized}>
                                        <Widget widget={widget} pageId={this.props.pageId} isEditMode={this.props.isEditMode}
                                                pageManagementMode={this.props.pageManagementMode}/>
                                    </GridItem>
                                    )
                            },this)
                        }
                    </Grid>
                    {(this.props.isEditMode || this.props.pageManagementMode) && <div className="gridStackBottomSpace"></div>}
                </div>
        );
    }
}

