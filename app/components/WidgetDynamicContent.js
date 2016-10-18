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

import fetch from 'isomorphic-fetch'

export default class WidgetDynamicContent extends Component {
    static propTypes = {
        //pageId: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        templates : PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        setContextValue: PropTypes.func.isRequired,
        onDrilldownToPage: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {data: {}};
    }

    _buildPluginContext () {
        return new PluginContext(this.props.setContextValue,this.props.context,this.props.onDrilldownToPage,this._fetchData.bind(this),this.props.templates,this.props.manager);

    }

    _fetchData() {
        if (this.props.widget.plugin.fetchUrl) {
            var context = this._buildPluginContext();

            var fetchUrl = _.replace(this.props.widget.plugin.fetchUrl,'[manager]', context.getManagerUrl());
            fetch(fetchUrl)
                .then(response => response.json())
                .then((data)=> {
                    console.log('widget :'+this.props.widget.name + ' data fetched');
                    this.setState({data: data});
                })
                .catch((e)=>{
                    console.error(e);
                    this.setState({error: 'Error fetching widget data'});
                });

        } else if (this.props.widget.plugin.fetchData && typeof this.props.widget.plugin.fetchData === 'function') {
            this.props.widget.plugin.fetchData(this.props.widget,this._buildPluginContext(),PluginUtils)
                .then((data)=> {
                    console.log('widget :'+this.props.widget.name + ' data fetched');
                    this.setState({data: data});
                })
                .catch((e)=>{
                    console.error(e);
                    this.setState({error: 'Error fetching widget data'});
                });
        }

    }
    // In component will mount fetch the data if needed
    componentDidMount() {
        console.log('widget :'+this.props.widget.name + ' mounted');
        this._fetchData();
    }

    componentWillUnmount() {
        console.log('widget :'+this.props.widget.name + ' unmounts');
    }
    renderWidget() {
        var widgetHtml = 'Loading...';
        if (this.props.widget.plugin && this.props.widget.plugin.render) {
            try {
                widgetHtml = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._buildPluginContext(),PluginUtils);
            } catch (e) {
                console.error('Error rendering widget - '+e.message,e.stack);
            }
        }
        return {__html: widgetHtml};
    }

    renderReact () {
        var widget = 'Loading...';
        if (this.props.widget.plugin && this.props.widget.plugin.render) {
            try {
                widget = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._buildPluginContext(),PluginUtils);
            } catch (e) {
                console.error('Error rendering widget - '+e.message,e.stack);
            }
        }
        return widget;
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
                    $(container).find(event.selector).on(event.event,(e)=>{event.fn(e,this.props.widget,this._buildPluginContext(),PluginUtils)});
                },this);
            } catch (e) {
                console.error('Error attaching events to widget',e);
            }
        }

        if (this.props.widget.plugin.postRender) {
            this.props.widget.plugin.postRender($(container),this.props.widget,this.state.data,this._buildPluginContext(),PluginUtils);
        }
    }
    render() {
        return (
            this.props.widget.plugin.isReact ?
            <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader')}>
                {this.renderReact()}
            </div>
                :
            <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader')}
                 dangerouslySetInnerHTML={this.renderWidget()} ref={(container)=>this.attachEvents(container)} />

        );
    }
}

