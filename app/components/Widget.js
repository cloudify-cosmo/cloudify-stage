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

export default class Widget extends Component {
    static propTypes = {
        pageId: PropTypes.string.isRequired,
        widget: PropTypes.object.isRequired,
        context: PropTypes.object.isRequired,
        templates : PropTypes.object.isRequired,
        manager: PropTypes.object.isRequired,
        onWidgetNameChange: PropTypes.func.isRequired,
        setContextValue: PropTypes.func.isRequired,
        onWidgetRemoved: PropTypes.func.isRequired
    };

    render() {
        return (
            <div className={'widgetItem ui segment '+
                            (this.props.widget.plugin && !this.props.widget.plugin.showBorder ? 'basic ' : '') +
                            (this.props.isEditMode && this.props.widget.plugin && !this.props.widget.plugin.showBorder ? 'borderOnHover ' : '') +
                            (this.props.widget.plugin && this.props.widget.plugin.color && this.props.widget.plugin.showBorder ? this.props.widget.plugin.color : '')
                            }>
                {
                    this.props.widget.plugin && this.props.widget.plugin.showHeader ?
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
                        :
                        ''
                }
                {
                    this.props.isEditMode ?
                        <div className='widgetEditButtons'>
                            <EditWidget pageId={this.props.pageId} widget={this.props.widget}/>
                            <i className="remove link icon small" onClick={()=>this.props.onWidgetRemoved(this.props.pageId,this.props.widget.id)}/>
                        </div>
                        :
                        ''
                }
                {
                    (this.props.widget.plugin &&
                    !_.isEmpty(_.get(this.props,'manager.tenants.selected')) &&
                    !_.get(this.props,'manager.tenants.isFetching'))?
                        <WidgetDynamicContent widget={this.props.widget}
                                              templates={this.props.templates}
                                              context={this.props.context}
                                              manager={this.props.manager}
                                              setContextValue={this.props.setContextValue}/>
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

