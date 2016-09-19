/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import PluginUtils from '../utils/pluginUtils';
import PluginContext from '../utils/pluginContext';
import EditWidgetIcon from './EditWidgetIcon';
import WidgetDynamicContent from './WidgetDynamicContent';

export default class Widget extends Component {
    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        templates : PropTypes.object.isRequired,
        onWidgetNameChange: PropTypes.func.isRequired,
        setContextValue: PropTypes.func.isRequired,
        onDrilldownToPage: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired
    };

    render() {
        return (
            <div id={this.props.widget.id}
                 className='grid-stack-item widget'
                 data-gs-auto-position={!(this.props.widget.x !== undefined && this.props.widget.y !== undefined)}
                 data-gs-x={this.props.widget.x}
                 data-gs-y={this.props.widget.y}
                 data-gs-width={this.props.widget.width}
                 data-gs-height={this.props.widget.height}>

                    <div className={'ui segment grid-stack-item-content '+ (this.props.widget.plugin && this.props.widget.plugin.color ? this.props.widget.plugin.color : 'red')}>
                        {
                            this.props.widget.plugin && this.props.widget.plugin.showHeader ?
                                <h5 className='ui header dividing'>
                                    <InlineEdit
                                        text={this.props.widget.name}
                                        change={data=>this.props.onWidgetNameChange(this.props.pageId,this.props.widget.id,data.name)}
                                        paramName="name"
                                        />
                                </h5>
                                :
                                ''
                        }

                        <div className='widgetEditButtons'>
                            <EditWidgetIcon/>
                            <i className="remove link icon small" onClick={()=>this.props.onWidgetRemoved(this.props.pageId,this.props.widget.id)}></i>
                        </div>

                        {
                            this.props.widget.plugin ?
                                <WidgetDynamicContent widget={this.props.widget}
                                                      templates={this.props.templates}
                                                      context={this.props.context}
                                                      setContextValue={this.props.setContextValue}
                                                      onDrilldownToPage={this.props.onDrilldownToPage}/>
                                :
                                <div className='ui segment basic' style={{height:'100%'}}>
                                    <div className="ui active inverted dimmer">
                                        <div className="ui text loader">Loading</div>
                                    </div>
                                </div>
                        }

                    </div>
            </div>
        );
    }
}

