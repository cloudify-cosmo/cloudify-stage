/**
 * Created by kinneretzin on 30/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import EditWidget from '../containers/EditWidget';
import stageUtils from '../utils/stageUtils';
import { EditableLabel, ErrorMessage, Icon, Loading, ReadmeModal } from './basic';
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
    }

    static propTypes = {
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        widgetData: PropTypes.object,
        setContextValue: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired,
        onWidgetUpdated: PropTypes.func.isRequired,
        fetchWidgetData: PropTypes.func.isRequired
    };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    widgetConfigUpdate(config) {
        const { onWidgetUpdated, widget } = this.props;
        if (config) {
            onWidgetUpdated(widget.id, { configuration: { ...widget.configuration, ...config } });
        }
    }

    onKeyDown(event) {
        const { onWidgetUpdated, widget } = this.props;
        if (event.keyCode === 27) {
            onWidgetUpdated(widget.id, { maximized: false });
        }
    }

    showReadmeModal() {
        const { widget } = this.props;
        const { readme } = widget.definition;
        let readmeContent = '';

        if (!_.isEmpty(readme)) {
            readmeContent = markdown.parse(widget.definition.readme);
        }
        this.setState({ readmeContent, showReadmeModal: true });
    }

    hideReadmeModal() {
        this.setState({ readmeContent: '', showReadmeModal: false });
    }

    isUserAuthorized() {
        const { manager, widget } = this.props;
        return stageUtils.isUserAuthorized(widget.definition.permission, manager);
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    componentDidUpdate(prevProps, prevState) {
        const { widget } = this.props;
        if (widget.maximized) {
            this.widgetItemRef.current.focus();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
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
                <div
                    tabIndex={widget.maximized ? '-1' : ''}
                    onKeyDown={this.onKeyDown.bind(this)}
                    ref={this.widgetItemRef}
                    className="widgetItem ui segment widgetWithoutContent"
                >
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
                </div>
            );
        }

        const helpIcon = (
            size = undefined // Setting size to 'undefined' means not overriding icon normal size
        ) =>
            widget.definition.helpUrl ? (
                <a key="helpLink" href={widget.definition.helpUrl} target="_blank">
                    <Icon name="help circle" size={size} link />
                </a>
            ) : (
                widget.definition.readme && (
                    <Icon
                        key="helpIcon"
                        name="help circle"
                        size={size}
                        link
                        onClick={this.showReadmeModal.bind(this)}
                    />
                )
            );

        return (
            <div
                tabIndex={widget.maximized ? '-1' : ''}
                onKeyDown={this.onKeyDown.bind(this)}
                ref={this.widgetItemRef}
                className={`widgetItem ui segment
                            ${widget.definition && !widget.definition.showBorder ? 'basic' : ''}
                            ${isEditMode && widget.definition && !widget.definition.showBorder ? 'borderOnHover ' : ''}
                            ${
                                widget.definition && widget.definition.color && widget.definition.showBorder
                                    ? widget.definition.color
                                    : ''
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

                <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                    {isEditMode ? (
                        <div className="widgetEditButtons">
                            <EditWidget widget={widget} onWidgetEdited={onWidgetUpdated} />
                            {helpIcon('small')}
                            <Icon name="remove" link size="small" onClick={() => onWidgetRemoved(widget.id)} />
                        </div>
                    ) : widget.definition.showHeader ? (
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
                    )}
                </div>

                {hasError ? (
                    <ErrorMessage autoHide={false} error="Cannot render widget. Check browser console for details." />
                ) : widget.definition &&
                  !_.isEmpty(_.get(this.props, 'manager.tenants.selected')) &&
                  !_.get(this.props, 'manager.tenants.isFetching') ? (
                    <WidgetDynamicContent
                        widget={widget}
                        context={context}
                        manager={manager}
                        data={widgetData}
                        setContextValue={setContextValue}
                        onWidgetConfigUpdate={this.widgetConfigUpdate.bind(this)}
                        fetchWidgetData={fetchWidgetData}
                    />
                ) : (
                    <Loading />
                )}

                <ReadmeModal open={showReadmeModal} content={readmeContent} onHide={this.hideReadmeModal.bind(this)} />
            </div>
        );
    }
}
