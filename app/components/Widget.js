/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import EditWidget from '../containers/EditWidget';
import WidgetDynamicContent from './WidgetDynamicContent';
import Consts from '../utils/consts';

export default class Widget extends Component {
    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        templates : PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        widgetData: PropTypes.object,
        onWidgetNameChange: PropTypes.func.isRequired,
        setContextValue: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired,
        onWidgetMaximize: PropTypes.func.isRequired,
        onWidgetConfigUpdate: PropTypes.func.isRequired,
        fetchWidgetData: PropTypes.func.isRequired
    };

    _widgetConfigUpdate(config) {
        if (config) {
            config = Object.assign({}, this.props.widget.configuration, config);
            this.props.onWidgetConfigUpdate(this.props.pageId, this.props.widget.id, config);
        }
    }

    _onKeyDown(event) {
        if (event.keyCode === 27) {
            this.props.onWidgetMaximize(this.props.pageId, this.props.widget.id, false);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.widget.maximized) {
            $(this.refs.widgetItem).focus();
        }
    }

    render() {

        if (!this.props.widget.definition) {
            return (
                <div tabIndex={this.props.widget.maximized?'-1':''} onKeyDown={this._onKeyDown.bind(this)} ref="widgetItem" className='widgetItem ui segment'>
                    {
                        this.props.isEditMode &&
                        <div className='widgetEditButtons'>
                            <i className="remove link icon small"
                               onClick={()=>this.props.onWidgetRemoved(this.props.pageId,this.props.widget.id)}/>
                        </div>
                    }
                    <div className='ui segment basic' style={{height:'100%'}}>
                        <div className="ui icon message error">
                            <i className="ban icon"></i>
                            Cannot load widget {this.props.widget.name}. It might not be installed in your env. Please contact administrator.
                        </div>
                    </div>
                </div>
            );
        }

        if (this.props.widget.definition && this.props.widget.definition.isAdmin && this.props.manager.auth.role !== Consts.ROLE_ADMIN) {
            return (
                <div className='widgetItem ui segment'>
                    {
                        this.props.isEditMode &&
                        <div className='widgetEditButtons'>
                            <i className="remove link icon small"
                               onClick={()=>this.props.onWidgetRemoved(this.props.pageId,this.props.widget.id)}/>
                        </div>
                    }
                    <div className='ui segment basic' style={{height:'100%'}}>
                        <div className="ui icon message error">
                            <i className="ban icon"></i>
                            Only admin can access this widget
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div tabIndex={this.props.widget.maximized?'-1':''} onKeyDown={this._onKeyDown.bind(this)} ref="widgetItem" className={`widgetItem ui segment
                            ${this.props.widget.definition && !this.props.widget.definition.showBorder ? 'basic' : ''}
                            ${this.props.isEditMode && this.props.widget.definition && !this.props.widget.definition.showBorder ? 'borderOnHover ' : ''}
                            ${this.props.widget.definition && this.props.widget.definition.color && this.props.widget.definition.showBorder ? this.props.widget.definition.color : ''}`
                            }>
                {
                    this.props.widget.definition && this.props.widget.definition.showHeader &&
                    <h5 className='ui header dividing'>
                        {
                            this.props.isEditMode ?
                            <InlineEdit
                                text={this.props.widget.name}
                                change={data=>this.props.onWidgetNameChange(this.props.pageId,this.props.widget.id,data.name)}
                                paramName="name"
                                />
                            :
                                <label>{this.props.widget.name}</label>
                            }
                    </h5>
                }
                {
                    this.props.isEditMode ?
                        <div className='widgetEditButtons'>
                            <EditWidget pageId={this.props.pageId} widget={this.props.widget}/>
                            <i className="remove link icon small" onClick={()=>this.props.onWidgetRemoved(this.props.pageId,this.props.widget.id)}/>
                        </div>
                        :
                        this.props.widget.definition.showHeader &&
                        <div className={`widgetViewButtons ${this.props.widget.maximized?'alwaysOnTop':''}`}>
                            {
                                this.props.widget.maximized ?
                                <i className="compress link icon"
                                   onClick={() => this.props.onWidgetMaximize(this.props.pageId, this.props.widget.id, false)}/>
                                :
                                <i className="expand link icon small"
                                   onClick={() => this.props.onWidgetMaximize(this.props.pageId, this.props.widget.id, true)}/>
                            }
                        </div>
                }
                {
                    (this.props.widget.definition &&
                    !_.isEmpty(_.get(this.props,'manager.tenants.selected')) &&
                    !_.get(this.props,'manager.tenants.isFetching'))?
                        <WidgetDynamicContent widget={this.props.widget}
                                              templates={this.props.templates}
                                              context={this.props.context}
                                              manager={this.props.manager}
                                              data={this.props.widgetData}
                                              setContextValue={this.props.setContextValue}
                                              onWidgetConfigUpdate={this._widgetConfigUpdate.bind(this)}
                                              fetchWidgetData={this.props.fetchWidgetData}/>
                        :
                        <div className='ui segment basic' style={{height:'100%'}}>
                            <div className="ui active inverted dimmer">
                                <div className="ui text loader">Loading</div>
                            </div>
                        </div>
                }

            </div>
        );
    }
}

