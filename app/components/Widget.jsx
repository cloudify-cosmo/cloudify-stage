/**
 * Created by kinneretzin on 30/08/2016.
 */

import PropTypes from 'prop-types';
import marked from 'marked';

import React, { Component } from 'react';

import EditWidget from '../containers/EditWidget';
import stageUtils from '../utils/stageUtils';
import { EditableLabel, ErrorMessage, Icon, Loading, ReadmeModal, Segment } from './basic';
import WidgetDynamicContent from './WidgetDynamicContent';

export default class Widget extends Component {
    constructor(props, context) {
        super(props, context);

        this.widgetItemRef = React.createRef();
        this.state = {
            hasError: false,
            readmeContent: '',
            showReadmeModal: false
        };
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    componentDidUpdate() {
        const { widget } = this.props;
        if (widget.maximized) {
            this.widgetItemRef.current.focus();
        }
    }

    componentDidCatch(error, info) {
        log.error(error, info);
    }

    onKeyDown(event) {
        const { onWidgetUpdated, widget } = this.props;
        if (event.keyCode === 27) {
            onWidgetUpdated(widget.id, { maximized: false });
        }
    }

    widgetConfigUpdate = config => {
        const { onWidgetUpdated, widget } = this.props;
        if (config) {
            onWidgetUpdated(widget.id, { configuration: { ...widget.configuration, ...config } });
        }
    };

    hideReadmeModal = () => {
        this.setState({ readmeContent: '', showReadmeModal: false });
    };

    showReadmeModal = () => {
        const { widget } = this.props;
        const { readme } = widget.definition;
        let readmeContent = '';

        if (!_.isEmpty(readme)) {
            readmeContent = marked(widget.definition.readme);
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
            widgetData
        } = this.props;
        if (!widget.definition) {
            return (
                <Segment
                    tabIndex={widget.maximized ? '-1' : ''}
                    onKeyDown={this.onKeyDown}
                    ref={this.widgetItemRef}
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
                    <div className="ui segment basic" style={{ height: '100%' }}>
                        <div className="ui icon message error">
                            <Icon name="ban" />
                            Cannot load widget {widget.name}. It might not be installed in your env. Please contact
                            administrator.
                        </div>
                    </div>
                </Segment>
            );
        }

        const helpIcon = (
            size = undefined // Setting size to 'undefined' means not overriding icon normal size
        ) =>
            widget.definition.helpUrl ? (
                <a key="helpLink" href={widget.definition.helpUrl} target="_blank" rel="noopener noreferrer">
                    <Icon name="help circle" size={size} link />
                </a>
            ) : (
                widget.definition.readme && (
                    <Icon key="helpIcon" name="help circle" size={size} link onClick={this.showReadmeModal} />
                )
            );

        return (
            <Segment
                tabIndex={widget.maximized ? '-1' : ''}
                onKeyDown={this.onKeyDown}
                ref={this.widgetItemRef}
                basic={widget.definition && !widget.definition.showBorder}
                color={
                    widget.definition && widget.definition.color && widget.definition.showBorder
                        ? widget.definition.color
                        : ''
                }
                className={`widgetItem ${
                    isEditMode && widget.definition && !widget.definition.showBorder ? 'borderOnHover ' : ''
                }`}
            >
                {widget.definition && widget.definition.showHeader && (
                    <h5 className="ui header dividing">
                        <EditableLabel
                            value={widget.name}
                            placeholder="Widget header"
                            enabled={isEditMode}
                            className="widgetName"
                            onChange={name => onWidgetUpdated(widget.id, { name })}
                        />
                    </h5>
                )}

                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                    {isEditMode && (
                        <div className="widgetEditButtons">
                            <EditWidget widget={widget} onWidgetEdited={onWidgetUpdated} />
                            {helpIcon('small')}
                            <Icon name="remove" link size="small" onClick={() => onWidgetRemoved(widget.id)} />
                        </div>
                    )}
                    {!isEditMode &&
                        (widget.definition.showHeader ? (
                            <div className={`widgetViewButtons ${widget.maximized ? 'alwaysOnTop' : ''}`}>
                                {widget.maximized
                                    ? [
                                          helpIcon(),
                                          <Icon
                                              key="compressIcon"
                                              name="compress"
                                              link
                                              onClick={() => onWidgetUpdated(widget.id, { maximized: false })}
                                          />
                                      ]
                                    : [
                                          helpIcon('small'),
                                          <Icon
                                              key="expandIcon"
                                              name="expand"
                                              link
                                              size="small"
                                              onClick={() => onWidgetUpdated(widget.id, { maximized: true })}
                                          />
                                      ]}
                            </div>
                        ) : (
                            <div className="widgetViewButtons">{helpIcon('small')}</div>
                        ))}
                </div>

                {hasError && (
                    <ErrorMessage autoHide={false} error="Cannot render widget. Check browser console for details." />
                )}
                {!hasError &&
                    (widget.definition &&
                    !_.isEmpty(_.get(this.props, 'manager.tenants.selected')) &&
                    !_.get(this.props, 'manager.tenants.isFetching') ? (
                        <WidgetDynamicContent
                            widget={widget}
                            context={context}
                            manager={manager}
                            data={widgetData}
                            setContextValue={setContextValue}
                            onWidgetConfigUpdate={this.widgetConfigUpdate}
                            fetchWidgetData={fetchWidgetData}
                        />
                    ) : (
                        <Loading />
                    ))}

                <ReadmeModal open={showReadmeModal} content={readmeContent} onHide={this.hideReadmeModal} />
            </Segment>
        );
    }
}

Widget.propTypes = {
    context: PropTypes.shape({}).isRequired,
    fetchWidgetData: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    manager: PropTypes.shape({
        tenants: PropTypes.shape({ selected: PropTypes.string, isFetching: PropTypes.bool })
    }).isRequired,
    onWidgetRemoved: PropTypes.func.isRequired,
    onWidgetUpdated: PropTypes.func.isRequired,
    setContextValue: PropTypes.func.isRequired,
    widget: PropTypes.shape({
        configuration: PropTypes.shape({}),
        id: PropTypes.string,
        name: PropTypes.string,
        definition: PropTypes.shape({
            color: PropTypes.string,
            helpUrl: PropTypes.string,
            permission: PropTypes.string,
            readme: PropTypes.string,
            showHeader: PropTypes.bool,
            showBorder: PropTypes.bool
        }),
        maximized: PropTypes.bool
    }).isRequired,
    widgetData: PropTypes.shape({}).isRequired
};
