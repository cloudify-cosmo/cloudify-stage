import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import type { RefObject } from 'react';
import React, { Component, createRef } from 'react';
import type { ErrorMessageProps, GridParams } from 'cloudify-ui-components';
import combineClassNames from '../../../../../utils/shared/combineClassNames';
import { getToolbox } from '../../../../../utils/Toolbox';
import WidgetParamsHandler from '../../../../../utils/WidgetParamsHandler';
import WidgetErrorMessage from './WidgetErrorMessage';
import type { ContextData } from '../../../../../reducers/contextReducer';
import type { Widget } from '../../../../../utils/StageAPI';
import type { ManagerData } from '../../../../../reducers/managerReducer';
import type { CancelablePromise } from '../../../../../utils/types';
import type { fetchWidgetData, FetchWidgetDataPromises } from '../../../../../actions/widgetData';

export interface WidgetDynamicContentProps {
    context: ContextData;
    data: {
        data: unknown;
        error: ErrorMessageProps['error'];
    };
    fetchWidgetData: (...args: Parameters<typeof fetchWidgetData>) => FetchWidgetDataPromises;
    onWidgetConfigUpdate: (config: { pageSize: number }) => void;
    manager: ManagerData;
    widget: Widget;
    standalone: boolean;
}

interface WidgetDynamicContentState {
    loading: boolean;
}

interface WidgetParams {
    gridParams: GridParams;
}

export default class WidgetDynamicContent extends Component<WidgetDynamicContentProps, WidgetDynamicContentState> {
    private readonly containerRef: RefObject<HTMLDivElement>;

    private loadingTimeout?: NodeJS.Timeout;

    private pollingTimeout?: NodeJS.Timeout;

    private fetchDataPromise?: CancelablePromise<unknown>;

    private paramsHandler: WidgetParamsHandler;

    private mounted: boolean;

    constructor(props: WidgetDynamicContentProps) {
        super(props);

        this.containerRef = createRef<HTMLDivElement>();

        this.state = {
            loading: false
        };
        this.mounted = false;
        this.paramsHandler = new WidgetParamsHandler(props.widget, this.getToolbox());
    }

    // In component will mount fetch the data if needed
    componentDidMount() {
        const { widget } = this.props;
        this.mounted = true;
        this.startPolling();

        log.log(`Widget '${widget.name}' mounted`);

        this.fetchData();
        this.postRender();
    }

    shouldComponentUpdate(nextProps: WidgetDynamicContentProps, nextState: WidgetDynamicContentState) {
        const { context, data, manager, widget } = this.props;
        return (
            !_.isEqual(widget, nextProps.widget) ||
            !_.isEqual(context, nextProps.context) ||
            !_.isEqual(manager, nextProps.manager) ||
            !_.isEqual(data, nextProps.data) ||
            !_.isEqual(this.state, nextState)
        );
    }

    componentDidUpdate(prevProps: WidgetDynamicContentProps) {
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

        if (widget.definition.isReact === false && widget.definition.postRender && this.containerRef.current) {
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

    loadingIndicator(show: boolean) {
        if (this.mounted) {
            this.setState({ loading: show });
        }
    }

    showLoading() {
        if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
        this.loadingTimeout = setTimeout(() => this.loadingIndicator(true), 1000);
    }

    hideLoading() {
        const { loading } = this.state;
        if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
        if (loading) this.loadingIndicator(false);
    }

    stopPolling() {
        if (this.pollingTimeout) clearTimeout(this.pollingTimeout);
        if (this.fetchDataPromise) this.fetchDataPromise.cancel();
    }

    startPolling() {
        const { widget } = this.props;
        this.stopPolling();

        const { pollingTime } = widget.configuration;
        const interval: number = Number.isInteger(pollingTime) ? Number(pollingTime) : 0;

        if (interval > 0 && this.mounted) {
            log.log(`Polling widget '${widget.name}' - time interval: ${interval} sec`);
            this.pollingTimeout = setTimeout(() => {
                this.fetchData();
            }, interval * 1000);
        }
    }

    updateConfiguration(params?: WidgetParams) {
        const { onWidgetConfigUpdate, widget } = this.props;
        const pageSize = params?.gridParams?.pageSize;

        if (pageSize && pageSize !== widget.configuration.pageSize) {
            onWidgetConfigUpdate({ pageSize });
        }
    }

    fetchData(params?: WidgetParams) {
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
                .then((data: any) => {
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
        let widgetHtml: string = i18n.t('widget.loading');
        if (widget.definition.isReact === false && widget.definition && widget.definition.render) {
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
