/**
 * Created by kinneretzin on 30/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { getToolbox } from '../utils/Toolbox';

import { ErrorMessage } from './basic';
import WidgetParamsHandler from '../utils/WidgetParamsHandler';

export default class WidgetDynamicContent extends Component {
    static propTypes = {
        widget: PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        data: PropTypes.object.isRequired,
        onWidgetConfigUpdate: PropTypes.func,
        fetchWidgetData: PropTypes.func.isRequired,
        pageId: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
        this.loadingTimeout = null;
        this.pollingTimeout = null;
        this.fetchDataPromise = null;
        this.mounted = false;
    }

    _getToolbox() {
        return getToolbox(this._fetchData.bind(this), this._loadingIndicator.bind(this), this.props.widget);
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
        if (this.mounted) {
            this.setState({ loading: show });
        }
    }

    _showLoading() {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => this._loadingIndicator(true), 1000);
    }

    _hideLoading() {
        clearTimeout(this.loadingTimeout);
        if (this.state.loading) {
            this._loadingIndicator(false);
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
        } catch (e) {
            console.log(
                `Polling interval doesnt have a valid value, using zero. Value is: ${this.props.widget.configuration.pollingTime}`
            );
            interval = 0;
        }

        if (interval > 0 && this.mounted) {
            console.log(`Polling widget '${this.props.widget.name}' - time interval: ${interval} sec`);
            this.pollingTimeout = setTimeout(() => {
                this._fetchData();
            }, interval * 1000);
        }
    }

    _updateConfiguration(params) {
        if (
            params.gridParams &&
            params.gridParams.pageSize &&
            params.gridParams.pageSize !== this.props.widget.configuration.pageSize
        ) {
            this.props.onWidgetConfigUpdate({ pageSize: params.gridParams.pageSize });
        }
    }

    _fetchData(params) {
        if (params) {
            this._paramsHandler.updateGridParams(params.gridParams);
            this._updateConfiguration(params);
        }

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }

        if (this.props.widget.definition.fetchUrl || _.isFunction(this.props.widget.definition.fetchData)) {
            this._beforeFetch();

            const promises = this.props.fetchWidgetData(this.props.widget, this._getToolbox(), this._paramsHandler);

            this.fetchDataPromise = promises.cancelablePromise;

            return promises.waitForPromise
                .then(data => {
                    // Fixes sort issue - add grid params to metadata to cheat shouldComponentUpdate
                    if (data) {
                        let metadata = [];
                        if (data.metadata) {
                            metadata = [data.metadata];
                        } else {
                            // Check for multiple fetches
                            metadata = _.filter(data, item => {
                                if (item.metadata) {
                                    return item.metadata;
                                }
                            });
                        }

                        _.each(metadata, item => {
                            item.gridParams = this._paramsHandler.getGridParams();
                        });
                    }

                    console.log(`Widget '${this.props.widget.name}' data fetched`);
                    this._afterFetch();
                })
                .catch(e => {
                    if (e.isCanceled) {
                        console.log(`Widget '${this.props.widget.name}' data fetch canceled`);
                        return;
                    }
                    this._afterFetch();
                });
        }

        return Promise.resolve();
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if any configuration that requires fetch was changed
        let requiresFetch = false;
        if (prevProps.widget.configuration && this.props.widget.configuration) {
            _.each(this.props.widget.configuration, (config, confName) => {
                // var oldConfig = _.find(prevProps.widget.configuration,{id:config});
                const oldConfig = prevProps.widget.configuration[confName];

                if (oldConfig !== config) {
                    this._paramsHandler.update(this.props.widget);

                    requiresFetch = true;
                    return false;
                }
            });
        }

        if (
            prevProps.manager.tenants.selected !== this.props.manager.tenants.selected ||
            // Fetch data after WIDGET_DATA_CLEAR action was dispatched (Fix for CY-957)
            (!_.isEmpty(prevProps.data) && _.isEmpty(this.props.data)) ||
            this._paramsHandler.updateFetchParams()
        ) {
            requiresFetch = true;
        }

        if (requiresFetch) {
            this._fetchData();
        }
    }

    // In component will mount fetch the data if needed
    componentDidMount() {
        this.mounted = true;
        this._startPolling();

        console.log(`Widget '${this.props.widget.name}' mounted`);

        this._paramsHandler = new WidgetParamsHandler(this.props.widget, this._getToolbox());
        this._fetchData();
    }

    componentWillUnmount() {
        this.mounted = false;
        this._stopPolling();

        console.log(`Widget '${this.props.widget.name}' unmounts`);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props.widget, nextProps.widget) ||
            !_.isEqual(this.props.context, nextProps.context) ||
            !_.isEqual(this.props.manager, nextProps.manager) ||
            !_.isEqual(this.props.data, nextProps.data) ||
            !_.isEqual(this.props.pageId, nextProps.pageId) ||
            !_.isEqual(this.state, nextState)
        );
    }

    renderWidget() {
        let widgetHtml = 'Loading...';
        if (this.props.widget.definition && this.props.widget.definition.render) {
            try {
                widgetHtml = this.props.widget.definition.render(
                    this.props.widget,
                    this.props.data.data,
                    this.props.data.error,
                    this._getToolbox()
                );
            } catch (e) {
                console.error(`Error rendering widget - ${e.message}`, e.stack);
            }
        }
        return { __html: widgetHtml };
    }

    renderReact() {
        if (this.props.data.error) {
            return <ErrorMessage error={this.props.data.error} header="An unexpected error occurred" autoHide />;
        }

        if (this.props.widget.definition && this.props.widget.definition.render) {
            try {
                return this.props.widget.definition.render(
                    this.props.widget,
                    this.props.data.data,
                    this.props.data.error,
                    this._getToolbox()
                );
            } catch (e) {
                console.error(`Error rendering widget - ${e.message}`, e.stack);
                return <ErrorMessage error={`Error rendering widget: ${e.message}`} autoHide />;
            }
        }
        return <div />;
    }

    attachEvents(container) {
        if (this.props.widget.definition && this.props.widget.definition.events) {
            try {
                _.each(
                    this.props.widget.definition.events,
                    event => {
                        if (!event || !event.selector || !event.event || !event.fn) {
                            console.warn('Cannot attach event, missing data. Event data is ', event);
                            return;
                        }
                        $(container)
                            .find(event.selector)
                            .off(event.event);
                        $(container)
                            .find(event.selector)
                            .on(event.event, e => {
                                event.fn(e, this.props.widget, this._getToolbox());
                            });
                    },
                    this
                );
            } catch (e) {
                console.error('Error attaching events to widget', e);
            }
        }

        if (this.props.widget.definition.postRender) {
            this.props.widget.definition.postRender(
                $(container),
                this.props.widget,
                this.props.data.data,
                this._getToolbox()
            );
        }
    }

    render() {
        return (
            <div>
                <div
                    className={`ui ${this.state.loading ? 'active' : ''} small inline loader widgetLoader ${
                        this.props.widget.definition.showHeader ? 'header' : 'noheader'
                    }`}
                />

                {this.props.widget.definition.isReact ? (
                    <div
                        className={`widgetContent${this.props.widget.definition.showHeader ? '' : ' noHeader '}${
                            this.props.widget.definition.showBorder ? '' : ' noBorder '
                        }`}
                    >
                        {this.renderReact()}
                    </div>
                ) : (
                    <div
                        className={`widgetContent${this.props.widget.definition.showHeader ? '' : ' noHeader'}`}
                        dangerouslySetInnerHTML={this.renderWidget()}
                        ref={container => this.attachEvents(container)}
                    />
                )}
            </div>
        );
    }
}
