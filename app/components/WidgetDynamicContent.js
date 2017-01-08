/**
 * Created by kinneretzin on 30/08/2016.
 */

import React, { Component, PropTypes } from 'react';
import StageUtils from '../utils/stageUtils';
import {getToolbox} from '../utils/Toolbox';

import {ErrorMessage} from './basic'
import fetch from 'isomorphic-fetch';

export default class WidgetDynamicContent extends Component {
    static propTypes = {
        widget: PropTypes.object.isRequired,
        templates : PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            loading: false
        };
        this.loadingTimeout = null;
        this.pollingTimeout = null;
        this.fetchDataPromise = null;
        this.mounted = false;
        this.fetchParams = {
            gridParams: {pageSize: this.props.widget.plugin.pageSize,
                sortColumn: this.props.widget.plugin.sortColumn,
                sortAscending: this.props.widget.plugin.sortAscending},
            filterParams: {}
        };
    }

    _getToolbox () {
        return getToolbox(this._fetchData.bind(this));
    }

    _fetch(url, toolbox) {
        var fetchUrl = _.replace(url,/\[config:(.*)\]/i,(match,configName)=>{
            return this.props.widget.configuration ? this.props.widget.configuration[configName] : 'NA';
        });

        // Only add auth token if we access the manager
        if (url.indexOf('[manager]') >= 0) {
            var baseUrl = url.substring('[manager]'.length);

            let params = {};
            if (url.indexOf('[params]') >= 0) {
                params = this._fetchParams();
                baseUrl = _.replace(baseUrl, '[params]', "");
            }

            return toolbox.getManager().doGet(baseUrl, params);
        } else {
            return fetch(fetchUrl).then(response => response.json())
        }
    }

    _fetchParams() {
        let params = {};

        let gridParams = this.fetchParams.gridParams;
        if (gridParams) {
            if (gridParams.sortColumn) {
                params._sort = `${gridParams.sortAscending?'':'-'}${gridParams.sortColumn}`;
            }

            if (gridParams.pageSize) {
                params._size=gridParams.pageSize;
            }

            if (gridParams.currentPage) {
                params._offset=(gridParams.currentPage-1)*gridParams.pageSize;
            }
        }

        let filterParams = this.fetchParams.filterParams;
        _.forIn(filterParams, function(value, key) {
            if (!(typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null)) {
                params[key] = value;
            }
        });

        return params;
    }

    _beforeFetch() {
        this._stopPolling();
        this._showLoading();
    }

    _afterFetch() {
        this._hideLoading();
        this._startPolling();
    }

    _showLoading() {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(()=>{this.setState({loading: true});}, 1000);
    }

    _hideLoading() {
        clearTimeout(this.loadingTimeout);
        if (this.state.loading) {
            this.setState({loading: false});
        }
    }

    _stopPolling() {
        clearTimeout(this.pollingTimeout);
    }

    _startPolling() {
        this._stopPolling();

        let interval = this.props.widget.configuration['pollingTime'] || 0;
        try {
            interval = Number.isInteger(interval) ? interval : parseInt(interval);
        } catch (e){
            console.log('Polling interval doesnt have a valid value, using zero. Value is: '+this.props.widget.configuration['pollingTime']);
            interval = 0;
        }

        if (interval > 0 && this.mounted) {
            console.log(`Polling widget '${this.props.widget.name}' - time interval: ${interval} sec`);
            this.pollingTimeout = setTimeout(()=>{this._fetchData()}, interval * 1000);
        }
    }

    _fetchData(params) {
        if (params) {
            this.fetchParams = _.merge({}, this.fetchParams, params.gridParams ? params : {filterParams: params});
        }

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }

        if (this.props.widget.plugin.fetchUrl) {
            this._beforeFetch();

            var toolbox = this._getToolbox();

            var url = this.props.widget.plugin.fetchUrl;

            var urls = _.isString(url) ? [url] : _.valuesIn(url);

            var fetches = _.map(urls,(url)=> this._fetch(url, toolbox));

            this.fetchDataPromise = StageUtils.makeCancelable(Promise.all(fetches));
            this.fetchDataPromise.promise
                    .then((data)=> {
                        console.log(`Widget '${this.props.widget.name}' data fetched`);

                        var output = data;
                        if (!_.isString(url)) {
                            output = {};
                            let keys = _.keysIn(url);
                            for (var i=0; i < data.length; i++) {
                                output[keys[i]] = data[i];
                            }
                        } else {
                            output = data[0];
                        }

                        this.setState({data: output, error: null});
                        this._afterFetch();
                    })
                    .catch((e)=>{
                        if (e.isCanceled) {
                            console.log(`Widget '${this.props.widget.name}' data fetch canceled`);
                            return;
                        }
                        console.error(e);
                        this.setState({error: 'Error fetching widget data'});
                        this._afterFetch();
                    });

        } else if (this.props.widget.plugin.fetchData && typeof this.props.widget.plugin.fetchData === 'function') {
            this._beforeFetch();

            this.fetchDataPromise = StageUtils.makeCancelable(
                                  this.props.widget.plugin.fetchData(this.props.widget,this._getToolbox(),this._fetchParams()));
            this.fetchDataPromise.promise
                .then((data)=> {
                    console.log(`Widget '${this.props.widget.name}' data fetched`);
                    this.setState({data: data,error: null});
                    this._afterFetch();
                })
                .catch((e)=>{
                    if (e.isCanceled) {
                        console.log(`Widget '${this.props.widget.name}' data fetch canceled`);
                        return;
                    }
                    console.error(e);
                    this.setState({error: 'Error fetching widget data'});
                    this._afterFetch();
                });
        }
    }

    componentDidUpdate(prevProps, prevState) {

        // Check if any configuration that requires fetch was changed
        var requiresFetch = false;
        if (prevProps.widget.configuration && this.props.widget.configuration) {

            _.each(this.props.widget.configuration,(config,confName)=>{
                //var oldConfig = _.find(prevProps.widget.configuration,{id:config.id});
                var oldConfig = prevProps.widget.configuration[confName];

                if (oldConfig !== config) {
                    requiresFetch = true;
                    return false;
                }
            })
        }

        if (prevProps.manager.tenants.selected !== this.props.manager.tenants.selected) {
            requiresFetch = true;
        }

        if (this.props.widget.plugin.fetchParams && typeof this.props.widget.plugin.fetchParams === 'function') {
            let params = this.props.widget.plugin.fetchParams(this.props.widget, this._getToolbox());

            let mergedParams = _.merge({}, this.fetchParams, {filterParams: params});
            if (!_.isEqual(this.fetchParams, mergedParams)) {
                this.fetchParams = mergedParams;
                requiresFetch = true;
            }
        }

        if (requiresFetch) {
            this._fetchData();
        }
    }

    // In component will mount fetch the data if needed
    componentDidMount() {
        this.mounted = true;

        console.log(`Widget '${this.props.widget.name}' mounted`);
        this._fetchData();
    }

    componentWillUnmount() {
        this.mounted = false;

        this._stopPolling();
        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
        console.log(`Widget '${this.props.widget.name}' unmounts`);
    }

    renderWidget() {
        var widgetHtml = 'Loading...';
        if (this.props.widget.plugin && this.props.widget.plugin.render) {
            try {
                widgetHtml = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._getToolbox());
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
                    return <ErrorMessage error={this.state.error}/>;
                }

                widget = this.props.widget.plugin.render(this.props.widget,this.state.data,this.state.error,this._getToolbox());
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
                    $(container).find(event.selector).on(event.event,(e)=>{event.fn(e,this.props.widget,this._getToolbox())});
                },this);
            } catch (e) {
                console.error('Error attaching events to widget',e);
            }
        }

        if (this.props.widget.plugin.postRender) {
            this.props.widget.plugin.postRender($(container),this.props.widget,this.state.data,this._getToolbox());
        }
    }
    render() {
        return (
            <div>
                <div className={`ui ${this.state.loading?'active':''} small inline loader widgetLoader ${this.props.widget.plugin.showHeader?'header':'noheader'}`}></div>

                {
                    this.props.widget.plugin.isReact ?
                    <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader ') + (this.props.widget.plugin.showBorder ? '' : ' noBorder ')}>
                        {this.renderReact()}
                    </div>
                    :
                    <div className={'widgetContent' + (this.props.widget.plugin.showHeader ? '' : ' noHeader')}
                         dangerouslySetInnerHTML={this.renderWidget()}
                         ref={(container)=>this.attachEvents(container)}/>
                }
            </div>
        );
    }
}

