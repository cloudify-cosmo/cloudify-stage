/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import PluginUtils from '../utils/pluginUtils';
import EditWidgetIcon from './EditWidgetIcon';
import {getContext} from '../utils/Context';

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

    _getContext () {
        return getContext(this._fetchData.bind(this));
    }

    _fetch(url,context) {
        var fetchUrl = _.replace(url,/\[config:(.*)\]/i,(match,configName)=>{
            var conf = this.props.widget.configuration ? _.find(this.props.widget.configuration,{id:configName}) : {};
            return conf && conf.value ? conf.value : 'NA';
        });

        if (_.startsWith(fetchUrl, '[manager]')) {
            fetchUrl = context.getManagerUrl(_.replace(fetchUrl,'[manager]', ''));
        }

        // Only add auth token if we access the manager
        if (url.indexOf('[manager]') >= 0) {
            var headers = {headers: context.getSecurityHeaders()};
            return fetch(fetchUrl,headers).then(response => response.json())
        } else {
            return fetch(fetchUrl).then(response => response.json())
        }
    }

    _fetchData() {
        if (this.props.widget.plugin.fetchUrl) {
            var context = this._getContext();

            var urls = this.props.widget.plugin.fetchUrl;
            if (!Array.isArray(urls)){
                urls = [urls];
            }

            var fetches = _.map(urls,(url)=>this._fetch(url,context));

            //this._fetch(this.props.widget.plugin.fetchUrl)
            Promise.all(fetches)
                .then((data)=> {
                    console.log('widget :'+this.props.widget.name + ' data fetched');
                    this.setState({data: data.length === 1 ? data[0] : data});
                })
                .catch((e)=>{
                    console.error(e);
                    this.setState({error: 'Error fetching widget data'});
                });

        } else if (this.props.widget.plugin.fetchData && typeof this.props.widget.plugin.fetchData === 'function') {
            this.props.widget.plugin.fetchData(this.props.widget,this._getContext(),PluginUtils)
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

    componentDidUpdate(prevProps, prevState) {
        // Check if any configuration that requires fetch was changed

        var requiresFetch = false;
        if (prevProps.widget.configuration && this.props.widget.configuration) {
            _.each(this.props.widget.configuration,(config)=>{
                var oldConfig = _.find(prevProps.widget.configuration,{id:config.id});
                if (oldConfig.value !== config.value && config.fetch) {
                    requiresFetch = true;
                }
            })
        }

        if (requiresFetch) {
            this._fetchData();
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
                widgetHtml = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._getContext(),PluginUtils);
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
                if (this.state.error) {
                    return PluginUtils.renderReactError(this.state.error);
                }

                widget = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._getContext(),PluginUtils);
            } catch (e) {
                console.error('Error rendering widget - '+e.message,e.stack);
            }
        }
        return widget;
    }

    attachEvents(container) {
        if (this.props.widget.plugin && this.props.widget.plugin.events) {
            try {
                _.each(this.props.widget.plugin.events,(event)=>{
                    if (!event || !event.selector || !event.event || !event.fn) {
                        console.warn('Cannot attach event, missing data. Event data is ',event);
                        return;
                    }
                    $(container).find(event.selector).off(event.event);
                    $(container).find(event.selector).on(event.event,(e)=>{event.fn(e,this.props.widget,this._getContext(),PluginUtils)});
                },this);
            } catch (e) {
                console.error('Error attaching events to widget',e);
            }
        }

        if (this.props.widget.plugin.postRender) {
            this.props.widget.plugin.postRender($(container),this.props.widget,this.state.data,this._getContext(),PluginUtils);
        }
    }
    render() {
        return (
            this.props.widget.plugin.isReact ?
            <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader ') + (this.props.widget.plugin.showBorder ? '' : ' noBorder ')}>
                {this.renderReact()}
            </div>
                :
            <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader')}
                 dangerouslySetInnerHTML={this.renderWidget()} ref={(container)=>this.attachEvents(container)} />

        );
    }
}

