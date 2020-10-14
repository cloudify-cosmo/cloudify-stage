/**
 * Created by kinneretzin on 30/08/2016.
 */

import _ from 'lodash';
import log from 'loglevel';
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { getToolbox } from '../utils/Toolbox';
import WidgetParamsHandler from '../utils/WidgetParamsHandler';
import { ErrorMessage } from './basic';
import WidgetPropType from '../utils/WidgetPropType';

export default class WidgetDynamicContent extends Component {
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

    // In component will mount fetch the data if needed
    componentDidMount() {
        const { widget } = this.props;
        this.mounted = true;
        this.startPolling();

        log.log(`Widget '${widget.name}' mounted`);

        this.paramsHandler = new WidgetParamsHandler(widget, this.getToolbox());
        this.fetchData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { context, data, manager, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(context, nextProps.context) ||
            !_.isEqual(manager, nextProps.manager) ||
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentDidUpdate(prevProps) {
        const { data, manager, widget } = this.props;
        // Check if any configuration that requires fetch was changed
        let requiresFetch = false;
        if (prevProps.widget.configuration && widget.configuration) {
            _.each(widget.configuration, (config, confName) => {
                const oldConfig = prevProps.widget.configuration[confName];

                if (oldConfig !== config) {
                    this.paramsHandler.update(widget);
                    requiresFetch = true;
                }

                return !requiresFetch;
            });
        }

        if (
            prevProps.manager.tenants.selected !== manager.tenants.selected ||
            // Fetch data after WIDGET_DATA_CLEAR action was dispatched (Fix for CY-957)
            (!_.isEmpty(prevProps.data) && _.isEmpty(data)) ||
            this.paramsHandler.updateFetchParams()
        ) {
            requiresFetch = true;
        }

        if (requiresFetch) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.stopPolling();

        const { widget } = this.props;
        log.log(`Widget '${widget.name}' unmounts`);
    }

    getToolbox() {
        const { widget } = this.props;
        return getToolbox(this.fetchData.bind(this), this.loadingIndicator.bind(this), widget);
    }

    beforeFetch() {
        this.stopPolling();
        this.showLoading();
    }

    afterFetch() {
        this.hideLoading();
        this.startPolling();
    }

    loadingIndicator(show) {
        if (this.mounted) {
            this.setState({ loading: show });
        }
    }

    showLoading() {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => this.loadingIndicator(true), 1000);
    }

    hideLoading() {
        const { loading } = this.state;
        clearTimeout(this.loadingTimeout);
        if (loading) {
            this.loadingIndicator(false);
        }
    }

    stopPolling() {
        clearTimeout(this.pollingTimeout);

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }
    }

    startPolling() {
        const { widget } = this.props;
        this.stopPolling();

        let interval = widget.configuration.pollingTime || 0;
        try {
            interval = Number.isInteger(interval) ? interval : parseInt(interval, 10);
        } catch (e) {
            log.log(
                `Polling interval doesnt have a valid value, using zero. Value is: ${widget.configuration.pollingTime}`
            );
            interval = 0;
        }

        if (interval > 0 && this.mounted) {
            log.log(`Polling widget '${widget.name}' - time interval: ${interval} sec`);
            this.pollingTimeout = setTimeout(() => {
                this.fetchData();
            }, interval * 1000);
        }
    }

    updateConfiguration(params) {
        const { onWidgetConfigUpdate, widget } = this.props;
        if (
            params.gridParams &&
            params.gridParams.pageSize &&
            params.gridParams.pageSize !== widget.configuration.pageSize
        ) {
            onWidgetConfigUpdate({ pageSize: params.gridParams.pageSize });
        }
    }

    fetchData(params) {
        const { fetchWidgetData, widget } = this.props;
        if (params) {
            this.paramsHandler.updateGridParams(params.gridParams);
            this.updateConfiguration(params);
        }

        if (this.fetchDataPromise) {
            this.fetchDataPromise.cancel();
        }

        if (widget.definition.fetchUrl || _.isFunction(widget.definition.fetchData)) {
            this.beforeFetch();

            const promises = fetchWidgetData(widget, this.getToolbox(), this.paramsHandler);

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
                            // eslint-disable-next-line consistent-return
                            metadata = _.filter(data, item => {
                                if (item.metadata) {
                                    return item.metadata;
                                }
                            });
                        }

                        _.each(metadata, item => {
                            item.gridParams = this.paramsHandler.getGridParams();
                        });
                    }

                    log.log(`Widget '${widget.name}' data fetched`);
                    this.afterFetch();
                })
                .catch(e => {
                    if (e.isCanceled) {
                        log.log(`Widget '${widget.name}' data fetch canceled`);
                        return;
                    }
                    this.afterFetch();
                });
        }

        return Promise.resolve();
    }

    attachEvents(container) {
        const { data, widget } = this.props;
        if (widget.definition && widget.definition.events) {
            try {
                _.each(
                    widget.definition.events,
                    event => {
                        if (!event || !event.selector || !event.event || !event.fn) {
                            log.warn('Cannot attach event, missing data. Event data is ', event);
                            return;
                        }
                        $(container)
                            .find(event.selector)
                            .off(event.event);
                        $(container)
                            .find(event.selector)
                            .on(event.event, e => {
                                event.fn(e, widget, this.getToolbox());
                            });
                    },
                    this
                );
            } catch (e) {
                log.error('Error attaching events to widget', e);
            }
        }

        if (widget.definition.postRender) {
            widget.definition.postRender($(container), widget, data.data, this.getToolbox());
        }
    }

    renderReact() {
        const { data, widget } = this.props;
        if (data.error) {
            log.error(data);
            return <ErrorMessage error={data.error} header="An unexpected error occurred" autoHide />;
        }

        if (widget.definition && widget.definition.render) {
            try {
                return widget.definition.render(widget, data.data, data.error, this.getToolbox());
            } catch (e) {
                log.error(`Error rendering widget - ${e.message}`, e.stack);
                return <ErrorMessage error={`Error rendering widget: ${e.message}`} autoHide />;
            }
        }
        return <div />;
    }

    renderWidget() {
        const { data, widget } = this.props;
        let widgetHtml = 'Loading...';
        if (widget.definition && widget.definition.render) {
            try {
                widgetHtml = widget.definition.render(widget, data.data, data.error, this.getToolbox());
            } catch (e) {
                log.error(`Error rendering widget - ${e.message}`, e.stack);
            }
        }
        return { __html: widgetHtml };
    }

    render() {
        const { widget } = this.props;
        const { loading } = this.state;
        return (
            <div>
                <div
                    className={`ui ${loading ? 'active' : ''} small inline loader widgetLoader ${
                        widget.definition.showHeader ? 'header' : 'noheader'
                    }`}
                />

                {widget.definition.isReact ? (
                    <div
                        className={`widgetContent${widget.definition.showHeader ? '' : ' noHeader '}${
                            widget.definition.showBorder ? '' : ' noBorder '
                        }`}
                    >
                        {this.renderReact()}
                    </div>
                ) : (
                    <div
                        className={`widgetContent${widget.definition.showHeader ? '' : ' noHeader'}`}
                        /* eslint-disable-next-line react/no-danger */
                        dangerouslySetInnerHTML={this.renderWidget()}
                        ref={container => this.attachEvents(container)}
                    />
                )}
            </div>
        );
    }
}

WidgetDynamicContent.propTypes = {
    context: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({ data: PropTypes.any, error: ErrorMessage.propTypes.error }).isRequired,
    fetchWidgetData: PropTypes.func.isRequired,
    onWidgetConfigUpdate: PropTypes.func.isRequired,
    manager: PropTypes.shape({ tenants: PropTypes.shape({ selected: PropTypes.string }) }).isRequired,
    widget: WidgetPropType.isRequired
};
