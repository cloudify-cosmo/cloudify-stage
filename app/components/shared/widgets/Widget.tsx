// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import log from 'loglevel';
import i18n from 'i18next';
import React, { Component, createRef, ErrorInfo, ReactElement } from 'react';
import { connect, ConnectedProps, MapStateToProps } from 'react-redux';

import { setValue } from '../../../actions/context';
import { fetchWidgetData as fetchWidgetDataThunk } from '../../../actions/WidgetData';
import EditWidget from '../../EditWidget';
import stageUtils from '../../../utils/stageUtils';
import { EditableLabel, ErrorMessage, Header, Icon, Loading, Message, ReadmeModal, Segment } from '../../basic';
import WidgetDynamicContent from '../../WidgetDynamicContent';
import type { ManagerData } from '../../../reducers/managerReducer';
import type { ReduxState } from '../../../reducers';
import type { Widget as WidgetObj } from '../../../utils/StageAPI';
import { getWidgetDefinitionById, SimpleWidgetObj } from '../../../actions/page';

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

interface WidgetState {
    hasError: boolean;
    readmeContent: string;
    showReadmeModal: boolean;
}

class Widget<Configuration> extends Component<WidgetProps<Configuration>, WidgetState> {
    private widgetItemRef = createRef<any>();

    constructor(props: WidgetProps<Configuration>) {
        super(props);

        this.state = {
            hasError: false,
            readmeContent: '',
            showReadmeModal: false
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
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

    widgetConfigUpdate = (config: Partial<Configuration>) => {
        const { onWidgetUpdated, widget } = this.props;
        if (config) {
            onWidgetUpdated?.(widget.id, { configuration: { ...widget.configuration, ...config } });
        }
    };

    hideReadmeModal = () => {
        this.setState({ readmeContent: '', showReadmeModal: false });
    };

    showReadmeModal = () => {
        const { widget } = this.props;
        const { readme } = widget.definition;
        let readmeContent = '';

        if (typeof readme === 'string') {
            readmeContent = stageUtils.parseMarkdown(readme);
        }
        this.setState({ readmeContent, showReadmeModal: true });
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
            setContextValue,
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
                                {i18n.t(
                                    'widget.loadError',
                                    'Cannot load widget {{widgetName}}. It might not be installed in your env. Please contact administrator.',
                                    { widgetName: widget.name }
                                )}
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
                widget.definition.readme && (
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
                                {onWidgetUpdated && (
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
                            error={i18n.t(
                                'widget.renderError',
                                'Cannot render widget. Check browser console for details.'
                            )}
                        />
                    )}
                    {!hasError &&
                        (widget.definition && !_.isEmpty(_.get(this.props, 'manager.tenants.selected')) ? (
                            <WidgetDynamicContent
                                widget={widget}
                                context={context}
                                manager={manager}
                                data={widgetData}
                                setContextValue={setContextValue}
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

const mapDispatchToProps = {
    setContextValue: setValue,
    fetchWidgetData: fetchWidgetDataThunk
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

// NOTE: necessary type asssertion for the generic parameter to work
const ConnectedWidget = (connector(Widget) as unknown) as <Configuration>(
    props: WidgetOwnProps<Configuration>
) => ReactElement<WidgetProps<Configuration>>;

export default ConnectedWidget;
