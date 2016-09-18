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

    constructor(props, context) {
        super(props, context);
    };

    _buildPluginContext () {
        return new PluginContext(this.props.setContextValue,this.props.context,this.props.onDrilldownToPage,this.props.templates);

    }

    renderWidget() {
        var widgetHtml = 'Loading...';
        if (this.props.widget.plugin && this.props.widget.plugin.render) {
            try {
                widgetHtml = this.props.widget.plugin.render(this.props.widget.plugin,this._buildPluginContext(),PluginUtils);
            } catch (e) {
                console.error('Error rendering widget',e);
            }
        }
        return {__html: widgetHtml};
    }

    attachEvents(container) {
        if (this.props.widget.plugin && this.props.widget.plugin.events) {
            try {
                //this.props.widget.plugin.attachEvents(this.props.widget.plugin,this._buildPluginContext(),PluginUtils);

                _.each(this.props.widget.plugin.events,(event)=>{
                    if (!event || !event.selector || !event.event || !event.fn) {
                        console.warn('Cannot attach event, missing data. Event data is ',event);
                        return;
                    }
                    $(container).find(event.selector).off(event.event);
                    $(container).find(event.selector).on(event.event,()=>{event.fn(this.props.widget,this._buildPluginContext(),PluginUtils)});
                },this);
            } catch (e) {
                console.error('Error attaching events to widget',e);
            }
        }
    }
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

                        <div dangerouslySetInnerHTML={this.renderWidget()} ref={(container)=>this.attachEvents(container)} />
                    </div>
            </div>
        );
    }
}

