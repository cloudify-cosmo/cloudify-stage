/**
 * Created by kinneretzin on 30/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import EditWidget from '../containers/EditWidget';
import WidgetDynamicContent from './WidgetDynamicContent';
import { Loading, Icon, ReadmeModal, EditableLabel } from './basic';
import stageUtils from '../utils/stageUtils';

export default class Widget extends Component {
    constructor(props, context) {
        super(props, context);

        this.widgetItemRef = React.createRef();
        this.state = {
            showReadmeModal: false,
            readmeContent: ''
        };
    }

    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        widgetData: PropTypes.object,
        onWidgetNameChange: PropTypes.func.isRequired,
        setContextValue: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired,
        onWidgetMaximize: PropTypes.func.isRequired,
        onWidgetConfigUpdate: PropTypes.func.isRequired,
        fetchWidgetData: PropTypes.func.isRequired,
        pageManagementMode: PropTypes.string
    };

    _widgetConfigUpdate(config) {
        if (config) {
            config = { ...this.props.widget.configuration, ...config };
            this.props.onWidgetConfigUpdate(this.props.pageId, this.props.widget.id, config);
        }
    }

    _onKeyDown(event) {
        if (event.keyCode === 27) {
            this.props.onWidgetMaximize(this.props.pageId, this.props.widget.id, false);
        }
    }

    _showReadmeModal() {
        const { readme } = this.props.widget.definition;
        let readmeContent = '';

        if (!_.isEmpty(readme)) {
            readmeContent = markdown.parse(this.props.widget.definition.readme);
        }
        this.setState({ readmeContent, showReadmeModal: true });
    }

    _hideReadmeModal() {
        this.setState({ readmeContent: '', showReadmeModal: false });
    }

    _isUserAuthorized() {
        return stageUtils.isUserAuthorized(this.props.widget.definition.permission, this.props.manager);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.widget.maximized) {
            this.widgetItemRef.current.focus();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState);
    }

    render() {
        if (!this.props.widget.definition) {
            return (
                <div
                    tabIndex={this.props.widget.maximized ? '-1' : ''}
                    onKeyDown={this._onKeyDown.bind(this)}
                    ref={this.widgetItemRef}
                    className="widgetItem ui segment widgetWithoutContent"
                >
                    <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                        {this.props.isEditMode && (
                            <div className="widgetEditButtons">
                                <i
                                    className="remove link icon small"
                                    onClick={() => this.props.onWidgetRemoved(this.props.pageId, this.props.widget.id)}
                                />
                            </div>
                        )}
                    </div>
                    <div className="ui segment basic" style={{ height: '100%' }}>
                        <div className="ui icon message error">
                            <i className="ban icon" />
                            Cannot load widget {this.props.widget.name}. It might not be installed in your env. Please
                            contact administrator.
                        </div>
                    </div>
                </div>
            );
        }

        const helpIcon = (
            size = undefined // Setting size to 'undefined' means not overriding icon normal size
        ) =>
            this.props.widget.definition.helpUrl ? (
                <a key="helpLink" href={this.props.widget.definition.helpUrl} target="_blank">
                    <Icon name="help circle" size={size} link />
                </a>
            ) : (
                this.props.widget.definition.readme && (
                    <Icon
                        key="helpIcon"
                        name="help circle"
                        size={size}
                        link
                        onClick={this._showReadmeModal.bind(this)}
                    />
                )
            );

        return (
            <div
                tabIndex={this.props.widget.maximized ? '-1' : ''}
                onKeyDown={this._onKeyDown.bind(this)}
                ref={this.widgetItemRef}
                className={`widgetItem ui segment
                            ${this.props.widget.definition && !this.props.widget.definition.showBorder ? 'basic' : ''}
                            ${
                                this.props.isEditMode &&
                                this.props.widget.definition &&
                                !this.props.widget.definition.showBorder
                                    ? 'borderOnHover '
                                    : ''
                            }
                            ${
                                this.props.widget.definition &&
                                this.props.widget.definition.color &&
                                this.props.widget.definition.showBorder
                                    ? this.props.widget.definition.color
                                    : ''
                            }`}
            >
                {this.props.widget.definition && this.props.widget.definition.showHeader && (
                    <h5 className="ui header dividing">
                        <EditableLabel
                            value={this.props.widget.name}
                            placeholder="Widget header"
                            enabled={this.props.isEditMode}
                            className="widgetName"
                            onChange={text =>
                                this.props.onWidgetNameChange(this.props.pageId, this.props.widget.id, text)
                            }
                        />
                    </h5>
                )}

                <div className="widgetButtons" onMouseDown={e => e.stopPropagation()}>
                    {this.props.isEditMode ? (
                        <div className="widgetEditButtons">
                            <EditWidget
                                pageId={this.props.pageId}
                                widget={this.props.widget}
                                pageManagementMode={this.props.pageManagementMode}
                            />
                            {helpIcon('small')}
                            <Icon
                                name="remove"
                                link
                                size="small"
                                onClick={() => this.props.onWidgetRemoved(this.props.pageId, this.props.widget.id)}
                            />
                        </div>
                    ) : this.props.widget.definition.showHeader ? (
                        <div className={`widgetViewButtons ${this.props.widget.maximized ? 'alwaysOnTop' : ''}`}>
                            {this.props.widget.maximized
                                ? [
                                      helpIcon(),
                                      <Icon
                                          key="compressIcon"
                                          name="compress"
                                          link
                                          onClick={() =>
                                              this.props.onWidgetMaximize(
                                                  this.props.pageId,
                                                  this.props.widget.id,
                                                  false
                                              )
                                          }
                                      />
                                  ]
                                : [
                                      helpIcon('small'),
                                      <Icon
                                          key="expandIcon"
                                          name="expand"
                                          link
                                          size="small"
                                          onClick={() =>
                                              this.props.onWidgetMaximize(this.props.pageId, this.props.widget.id, true)
                                          }
                                      />
                                  ]}
                        </div>
                    ) : (
                        <div className="widgetViewButtons">{helpIcon('small')}</div>
                    )}
                </div>

                {this.props.widget.definition &&
                !_.isEmpty(_.get(this.props, 'manager.tenants.selected')) &&
                !_.get(this.props, 'manager.tenants.isFetching') ? (
                    <WidgetDynamicContent
                        widget={this.props.widget}
                        context={this.props.context}
                        manager={this.props.manager}
                        data={this.props.widgetData}
                        setContextValue={this.props.setContextValue}
                        onWidgetConfigUpdate={this._widgetConfigUpdate.bind(this)}
                        fetchWidgetData={this.props.fetchWidgetData}
                        pageId={this.props.pageId}
                    />
                ) : (
                    <Loading />
                )}

                <ReadmeModal
                    open={this.state.showReadmeModal}
                    content={this.state.readmeContent}
                    onHide={this._hideReadmeModal.bind(this)}
                />
            </div>
        );
    }
}
