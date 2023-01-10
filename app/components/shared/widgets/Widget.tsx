import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import type { ErrorInfo, ReactElement } from 'react';
import React, { Component, createRef } from 'react';
import type { ConnectedProps, MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';

import type { SimpleWidgetObj } from '../../../actions/page';
import { getWidgetDefinitionById } from '../../../actions/page';
import { fetchWidgetData as fetchWidgetDataThunk } from '../../../actions/widgetData';
import { updateWidgetDefinition as updateWidgetDefinitionThunk } from '../../../actions/widgetDefinitions';
import type { ReduxState } from '../../../reducers';
import type { ManagerData } from '../../../reducers/managerReducer';
import LoaderUtils from '../../../utils/LoaderUtils';
import type { Widget as WidgetObj } from '../../../utils/StageAPI';
import stageUtils from '../../../utils/stageUtils';
import WidgetDefinitionsLoader from '../../../utils/widgetDefinitionsLoader';
import { EditableLabel, ErrorMessage, Header, Icon, Loading, Message, ReadmeModal, Segment } from '../../basic';
import EditWidget from '../../EditWidget';
import WidgetDynamicContent from '../../WidgetDynamicContent';
import type { ReduxThunkDispatch } from '../../../configureStore';

export interface WidgetOwnProps<Configuration> {
    isEditMode: boolean;
    /**
     * Called when the widget configuration is changed or the widget is maximized or minimized.
     */
    onWidgetUpdated?: (widgetId: string, params: Partial<WidgetObj<Configuration>>) => void;
    onWidgetRemoved: (widgetId: string) => void;
    widget: SimpleWidgetObj;
    /**
     * Whether the widget is rendered as a single item (standalone), or inside a grid.
     * Depending on this prop, the widget will have different style for its position.
     */
    standalone?: boolean;
}

type WidgetProps<Configuration> = Omit<WidgetOwnProps<Configuration>, 'widget'> & PropsFromRedux;

export type FetchWidgetDataProp = PropsFromRedux['fetchWidgetData'];

interface WidgetState {
    hasError: boolean;
    readmeContent: string;
    showReadmeModal: boolean;
}

const tReadme = stageUtils.getT('widgets.common.readmes');

function updateReadmeLinks(content: any) {
    const linkRegex = /(\[.*?\])\(\s*(?!http)(.*?)\s*\)/gm;
    const anchorHrefRegex = /<a href="([^#]*?)">/gm;

    const newContent = content
        .replace(anchorHrefRegex, `<a href="${tReadme('linksBasePath')}$1">`)
        .replace(linkRegex, `$1(${tReadme('linksBasePath')}$2)`);

    return newContent;
}

function convertReadmeParams(content: any) {
    const paramRegex = /{{<\s*param\s*(\S*)\s*>}}/gm;
    let newContent = content;

    Array.from(newContent.matchAll(paramRegex)).forEach((match: any) => {
        const paramName = match[1];
        const paramValue = tReadme(`params.${paramName}`);
        if (paramValue !== undefined) {
            newContent = newContent.replace(match[0], paramValue);
        }
    });

    return newContent;
}

class Widget<Configuration extends Record<string, unknown> = Record<string, unknown>> extends Component<
    WidgetProps<Configuration>,
    WidgetState
> {
    private widgetItemRef = createRef<any>();

    constructor(props: WidgetProps<Configuration>) {
        super(props);

        this.state = {
            hasError: false,
            showReadmeModal: false,
            readmeContent: ''
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidMount() {
        const { widget, updateWidgetDefinition } = this.props;
        if (!widget.definition.loaded) {
            WidgetDefinitionsLoader.loadWidget(widget.definition).then(widgetDefinition => {
                if (widgetDefinition) updateWidgetDefinition(widgetDefinition.id, widgetDefinition);
            });
        }
    }

    shouldComponentUpdate(nextProps: WidgetProps<Configuration>, nextState: WidgetState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate() {
        const { widget } = this.props;
        if (widget.maximized) {
            this.widgetItemRef.current.focus();
        }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        log.error(error, info);
    }

    onKeyDown = (event: any) => {
        const { onWidgetUpdated, widget } = this.props;
        const escapeKeyCode = 27;

        if (event.keyCode === escapeKeyCode) {
            onWidgetUpdated?.(widget.id, { maximized: false });
        }
    };

    widgetConfigUpdate = (config: Record<string, unknown>) => {
        const { onWidgetUpdated, widget } = this.props;
        if (config) {
            onWidgetUpdated?.(widget.id, { configuration: { ...widget.configuration, ...config } });
        }
    };

    hideReadmeModal = () => {
        this.setState({ showReadmeModal: false });
    };

    showReadmeModal = () => {
        const { widget } = this.props;
        let { readmeContent } = this.state;

        if (!readmeContent) {
            this.setState({ readmeContent: tReadme('loading') });
            LoaderUtils.fetchResource(`widgets/${widget.definition.id}/README.md`, widget.definition.isCustom).then(
                (fetchedReadme: any) => {
                    if (fetchedReadme) {
                        readmeContent = widget.definition.isCustom
                            ? fetchedReadme
                            : updateReadmeLinks(convertReadmeParams(fetchedReadme));
                        if (typeof readmeContent === 'string') {
                            readmeContent = stageUtils.parseMarkdown(readmeContent);
                        }
                    } else {
                        readmeContent = tReadme('noReadme');
                    }
                    this.setState({ readmeContent });
                }
            );
        }

        this.setState({ showReadmeModal: true });
    };

    isUserAuthorized() {
        const { manager, widget } = this.props;
        return stageUtils.isUserAuthorized(widget.definition.permission, manager);
    }

    render() {
        const { hasError, readmeContent, showReadmeModal } = this.state;
        const {
            context,
            fetchWidgetData,
            isEditMode,
            manager,
            onWidgetUpdated,
            onWidgetRemoved,
            widget,
            widgetData,
            standalone = false
        } = this.props;
        if (!widget.definition) {
            return (
                <div ref={this.widgetItemRef}>
                    <Segment
                        tabIndex={widget.maximized ? '-1' : ''}
                        onKeyDown={this.onKeyDown}
                        className="widgetItem widgetWithoutContent"
                    >
                        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                        <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                            {isEditMode && (
                                <div className="widgetEditButtons">
                                    <Icon link size="small" name="remove" onClick={() => onWidgetRemoved(widget.id)} />
                                </div>
                            )}
                        </div>
                        <Segment basic style={{ height: '100%' }}>
                            <Message icon error>
                                <Icon name="ban" />
                                {i18n.t('widget.loadError', { widgetName: widget.name })}
                            </Message>
                        </Segment>
                    </Segment>
                </div>
            );
        }

        // Setting size to 'undefined' means not overriding icon normal size
        const widgetIconButtonSize = widget.definition.showHeader ? undefined : 'small';
        const helpIcon = () =>
            widget.definition.helpUrl ? (
                <a key="helpLink" href={widget.definition.helpUrl} target="_blank" rel="noopener noreferrer">
                    <Icon name="help circle" size={widgetIconButtonSize} link />
                </a>
            ) : (
                widget.definition.hasReadme && (
                    <Icon
                        key="helpIcon"
                        name="help circle"
                        size={widgetIconButtonSize}
                        link
                        onClick={this.showReadmeModal}
                    />
                )
            );

        return (
            <div ref={this.widgetItemRef}>
                <Segment
                    tabIndex={widget.maximized ? '-1' : ''}
                    onKeyDown={this.onKeyDown}
                    basic={widget.definition && !widget.definition.showBorder}
                    color={
                        widget.definition && widget.definition.color && widget.definition.showBorder
                            ? widget.definition.color
                            : undefined
                    }
                    className={stageUtils.combineClassNames([
                        'widgetItem',
                        isEditMode && widget.definition && !widget.definition.showBorder && 'borderOnHover',
                        !widget.definition.showHeader && 'headerless',
                        standalone && 'standalone'
                    ])}
                >
                    {widget.definition && widget.definition.showHeader && (
                        <Header as="h5" dividing>
                            <EditableLabel
                                value={widget.name}
                                placeholder="Widget header"
                                enabled={isEditMode}
                                className="widgetName"
                                onChange={name => onWidgetUpdated?.(widget.id, { name })}
                            />
                        </Header>
                    )}

                    {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                    <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                        {isEditMode && (
                            <div className="widgetEditButtons">
                                {onWidgetUpdated && widget.definition.loaded && (
                                    <EditWidget
                                        widget={widget}
                                        onWidgetEdited={onWidgetUpdated}
                                        iconSize={widgetIconButtonSize}
                                    />
                                )}
                                {helpIcon()}
                                <Icon
                                    name="remove"
                                    link
                                    size={widgetIconButtonSize}
                                    onClick={() => onWidgetRemoved(widget.id)}
                                />
                            </div>
                        )}
                        {!isEditMode &&
                            (widget.definition.showHeader ? (
                                <div className={`widgetViewButtons ${widget.maximized ? 'alwaysOnTop' : ''}`}>
                                    {helpIcon()}
                                    {onWidgetUpdated && (
                                        <Icon
                                            name={widget.maximized ? 'compress' : 'expand'}
                                            link
                                            size={widgetIconButtonSize}
                                            onClick={() => onWidgetUpdated(widget.id, { maximized: !widget.maximized })}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="widgetViewButtons">{helpIcon()}</div>
                            ))}
                    </div>

                    {hasError && (
                        <ErrorMessage
                            autoHide={false}
                            header={i18n.t('widget.renderError.title')}
                            error={i18n.t('widget.renderError.content')}
                        />
                    )}
                    {!hasError &&
                        (widget.definition && !_.isEmpty(_.get(this.props, 'manager.tenants.selected')) ? (
                            <WidgetDynamicContent
                                widget={widget}
                                context={context}
                                manager={manager}
                                data={widgetData}
                                onWidgetConfigUpdate={this.widgetConfigUpdate}
                                fetchWidgetData={fetchWidgetData}
                                standalone={standalone}
                            />
                        ) : (
                            <Loading />
                        ))}

                    <ReadmeModal open={showReadmeModal} content={readmeContent} onHide={this.hideReadmeModal} />
                </Segment>
            </div>
        );
    }
}

interface ReduxStateToProps<Configuration> {
    context: any;
    manager: ManagerData;
    widgetData: any;
    widget: WidgetObj<Configuration>;
}

const mapStateToProps: MapStateToProps<ReduxStateToProps<any>, WidgetOwnProps<any>, ReduxState> = (state, ownProps) => {
    return {
        context: state.context,
        manager: state.manager || {},
        widgetData: _.find(state.widgetData, { id: ownProps.widget.id }) || {},
        widget: {
            ...ownProps.widget,
            // NOTE: assume definition will always be found
            definition: getWidgetDefinitionById(ownProps.widget.definition, state.widgetDefinitions)!
        }
    };
};

const mapDispatchToProps = (dispatch: ReduxThunkDispatch) => ({
    fetchWidgetData: (...args: Parameters<typeof fetchWidgetDataThunk>) => dispatch(fetchWidgetDataThunk(...args)),
    updateWidgetDefinition: (...args: Parameters<typeof updateWidgetDefinitionThunk>) =>
        dispatch(updateWidgetDefinitionThunk(...args))
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

// NOTE: necessary type asssertion for the generic parameter to work
const ConnectedWidget = connector(Widget) as unknown as <Configuration>(
    props: WidgetOwnProps<Configuration>
) => ReactElement<WidgetProps<Configuration>>;

export default ConnectedWidget;
