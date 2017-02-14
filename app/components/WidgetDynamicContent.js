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
        manager: PropTypes.object.isRequired,
        onWidgetConfigUpdate: PropTypes.func
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
            gridParams: {pageSize: this.props.widget.configuration.pageSize,
                sortColumn: this.props.widget.configuration.sortColumn,
                sortAscending: this.props.widget.configuration.sortAscending},
            filterParams: {}
        };
    }

    _getToolbox () {
        return getToolbox(this._fetchData.bind(this), this._loadingIndicator.bind(this));
    }

    _getUrlRegExString(str) {
        return new RegExp('\\[' + str + ':?(.*)\\]', 'i');
    }

    _parseParams(params, allowedParams) {
        if (!_.isEmpty(allowedParams)) {
            allowedParams = _.replace(allowedParams, 'gridParams', '_sort,_size,_offset').split(',');
            params = _.pick(params, allowedParams);
        }
        return params;
    }

    _fetch(url, toolbox) {

        var fetchUrl = _.replace(url,this._getUrlRegExString('config'),(match,configName)=>{
            return this.props.widget.configuration ? this.props.widget.configuration[configName] : 'NA';
        });

        // Only add auth token if we access the manager
        if (url.indexOf('[manager]') >= 0) {
            var baseUrl = url.substring('[manager]'.length);

            let params = {};
            let paramsMatch = this._getUrlRegExString('params').exec(url);
            if (!_.isNull(paramsMatch)) {
                params = this._fetchParams();

                let [paramsString, allowedParams] = paramsMatch;
                params = this._parseParams(params, allowedParams);

                baseUrl = _.replace(baseUrl, paramsString, '');
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

    _loadingIndicator(show) {
        this.setState({loading: show})
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

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
    }

    _startPolling() {
        this._stopPolling();

        let interval = this.props.widget.configuration.pollingTime || 0;
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

    _updateConfiguration(params) {
        if (params.gridParams && params.gridParams.pageSize &&
            params.gridParams.pageSize !== this.props.widget.configuration.pageSize) {
            this.props.onWidgetConfigUpdate({pageSize: params.gridParams.pageSize});
        }
    }

    _fetchData(params) {
        if (params) {
            Object.assign(this.fetchParams.gridParams, params.gridParams);
            this._updateConfiguration(params);
        }

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }

        if (this.props.widget.definition.fetchUrl) {
            this._beforeFetch();

            var toolbox = this._getToolbox();

            var url = this.props.widget.definition.fetchUrl;

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

        } else if (this.props.widget.definition.fetchData && typeof this.props.widget.definition.fetchData === 'function') {
            this._beforeFetch();

            this.fetchDataPromise = StageUtils.makeCancelable(
                                  this.props.widget.definition.fetchData(this.props.widget,this._getToolbox(),this._fetchParams()));
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

        if (this.props.widget.definition.fetchParams && typeof this.props.widget.definition.fetchParams === 'function') {
            let params = this.props.widget.definition.fetchParams(this.props.widget, this._getToolbox());

            if (!_.isEqual(this.fetchParams.filterParams, params)) {
                this.fetchParams.filterParams = params;
                requiresFetch = true;
            }
        }

        if (requiresFetch) {
            this._fetchData();
        }
    }

    // In component will mount fetch the data if needed
    componentDidMount() {
        $(window).on("focus", this._startPolling.bind(this));
        $(window).on("blur", this._stopPolling.bind(this));

        this.mounted = true;

        console.log(`Widget '${this.props.widget.name}' mounted`);
        this._fetchData();
    }

    componentWillUnmount() {
        $(window).off("focus", this._startPolling.bind(this));
        $(window).off("blur", this._stopPolling.bind(this));

        this.mounted = false;

        this._stopPolling();

        console.log(`Widget '${this.props.widget.name}' unmounts`);
    }

    renderWidget() {
        var widgetHtml = 'Loading...';
        if (this.props.widget.definition && this.props.widget.definition.render) {
            try {
                widgetHtml = this.props.widget.definition.render(this.props.widget,this.state.data,this.state.error,this._getToolbox());
            } catch (e) {
                console.error('Error rendering widget - '+e.message,e.stack);
            }
        }
        return {__html: widgetHtml};
    }

    renderReact () {
        var widget = 'Loading...';
        if (this.props.widget.definition && this.props.widget.definition.render) {
            try {
                if (this.state.error) {
                    return <ErrorMessage error={this.state.error}/>;
                }

                widget = this.props.widget.definition.render(this.props.widget,this.state.data,this.state.error,this._getToolbox());
            } catch (e) {
                console.error('Error rendering widget - '+e.message,e.stack);
            }
        }
        return widget;
    }

    attachEvents(container) {
        if (this.props.widget.definition && this.props.widget.definition.events) {
            try {
                _.each(this.props.widget.definition.events,(event)=>{
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

        if (this.props.widget.definition.postRender) {
            this.props.widget.definition.postRender($(container),this.props.widget,this.state.data,this._getToolbox());
        }
    }
    render() {
        return (
            <div>
                <div className={`ui ${this.state.loading?'active':''} small inline loader widgetLoader ${this.props.widget.definition.showHeader?'header':'noheader'}`}></div>

                {
                    this.props.widget.definition.isReact ?
                    <div className={'widgetContent' + (this.props.widget.definition.showHeader ? '' : ' noHeader ') + (this.props.widget.definition.showBorder ? '' : ' noBorder ')}>
                        {this.renderReact()}
                    </div>
                    :
                    <div className={'widgetContent' + (this.props.widget.definition.showHeader ? '' : ' noHeader')}
                         dangerouslySetInnerHTML={this.renderWidget()}
                         ref={(container)=>this.attachEvents(container)}/>
                }
            </div>
        );
    }
}

