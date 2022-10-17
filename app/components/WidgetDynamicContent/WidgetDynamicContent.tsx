// @ts-nocheck File not migrated fully to TS

import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import PropTypes from 'prop-types';
import type { RefObject } from 'react';
import React, { Component, createRef } from 'react';
import { Message } from 'semantic-ui-react';
import WidgetPropType from '../../utils/props/WidgetPropType';
import combineClassNames from '../../utils/shared/combineClassNames';
import { getToolbox } from '../../utils/Toolbox';
import WidgetParamsHandler from '../../utils/WidgetParamsHandler';
import { ErrorMessage } from '../basic';
import WidgetErrorMessage from './WidgetErrorMessage';

export default class WidgetDynamicContent extends Component {
    private readonly containerRef: RefObject<HTMLElement>;

    constructor(props) {
        super(props);

        this.containerRef = createRef<HTMLElement>();

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
        this.postRender();
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

        if (widget.definition.loaded && !prevProps.widget.definition.loaded) {
            this.paramsHandler = new WidgetParamsHandler(widget, this.getToolbox());
        }

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
            this.paramsHandler.updateFetchParams() ||
            prevProps.widget.definition.loaded !== widget.definition.loaded
        ) {
            requiresFetch = true;
        }

        if (requiresFetch) {
            this.fetchData();
        }
        this.postRender();
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

    postRender() {
        const { data, widget } = this.props;

        if (widget.definition.postRender && this.containerRef.current) {
            widget.definition.postRender(this.containerRef.current, widget, data.data, this.getToolbox());
        }
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

    renderReact() {
        const { data, widget } = this.props;
        const showErrorInPopup = !widget.definition.showBorder;

        if (data.error) {
            log.error(data);

            return (
                <WidgetErrorMessage
                    widgetName={widget.definition.name}
                    showErrorInPopup={showErrorInPopup}
                    header={i18n.t('widget.fetchingError')}
                    content={data.error}
                />
            );
        }

        if (widget.definition && widget.definition.render) {
            try {
                return widget.definition.render(widget, data.data, data.error, this.getToolbox());
            } catch (e) {
                log.error(
                    `Error rendering '${widget.definition.name}' widget (widget id: ${widget.definition.id}) - ${e.message}`,
                    e.stack
                );

                return (
                    <WidgetErrorMessage
                        widgetName={widget.definition.name}
                        showErrorInPopup={showErrorInPopup}
                        header={i18n.t('widget.renderError.title')}
                        content={i18n.t('widget.renderError.content')}
                    />
                );
            }
        }
        return <div />;
    }

    renderWidget() {
        const { data, widget } = this.props;
        let widgetHtml = i18n.t('widget.loading');
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
        const { widget, standalone } = this.props;
        const { loading } = this.state;
        const baseWidgetContentClassName = combineClassNames([
            'widgetContent',
            !widget.definition.showHeader && 'noHeader',
            standalone && 'standalone'
        ]);

        return (
            <div>
                <div
                    className={combineClassNames([
                        'ui small inline loader widgetLoader',
                        loading && 'active',
                        widget.definition.showHeader ? 'header' : 'noheader'
                    ])}
                />

                {widget.definition.isReact ? (
                    <div
                        className={combineClassNames([
                            baseWidgetContentClassName,
                            !widget.definition.showBorder && 'noBorder'
                        ])}
                    >
                        {this.renderReact()}
                    </div>
                ) : (
                    <div
                        className={baseWidgetContentClassName}
                        /* eslint-disable-next-line react/no-danger */
                        dangerouslySetInnerHTML={this.renderWidget()}
                        ref={this.containerRef}
                    />
                )}
            </div>
        );
    }
}

WidgetDynamicContent.propTypes = {
    context: PropTypes.shape({}).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.shape({ data: PropTypes.any.isRequired, error: ErrorMessage.propTypes?.error }),
    fetchWidgetData: PropTypes.func.isRequired,
    onWidgetConfigUpdate: PropTypes.func.isRequired,
    manager: PropTypes.shape({ tenants: PropTypes.shape({ selected: PropTypes.string }) }).isRequired,
    widget: WidgetPropType.isRequired,
    standalone: PropTypes.bool.isRequired
};
