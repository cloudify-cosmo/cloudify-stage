/**
 * Created by kinneretzin on 30/08/2016.
 */

/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import PluginUtils from '../utils/pluginUtils';
import PluginContext from '../utils/pluginContext';
import EditWidgetIcon from './EditWidgetIcon';


export default class Widget extends Component {
    static propTypes = {
        widget: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            isInEditMode: false,
            name: "Demo Widget"
        };
        this.dataChanged = this.dataChanged.bind(this);
    };

    componentDidMount() {
    }


    dataChanged(data) {
        this.setState({...data})
    }

    renderWidget() {
        var widgetHtml = 'widget content';
        if (this.props.widget.plugin && this.props.widget.plugin.render) {
            try {
                widgetHtml = this.props.widget.plugin.render(this.props.widget.plugin,PluginContext,PluginUtils);
            } catch (e) {
                console.error('Error rendering widget',e);
            }
        }
        return {__html: widgetHtml};
    }

    render() {
        return (
            <div id={this.props.widget.id}
                 className='grid-stack-item widget'
                 data-gs-auto-position='true' data-gs-width={this.props.widget.width} data-gs-height={this.props.widget.height}>
                    {/*
                    <Flipcard type="vertical">
                        <div className='ui segment red widgetContent' >
                            <h5 className='ui header dividing'>{widget.name}</h5>
                        </div>
                        <div className='ui segment red widgetContent'>
                            <h5 className='ui header dividing'>{widget.name} edit mode</h5>
                        </div>
                    </Flipcard>
                    */}

                    <div className={'ui segment grid-stack-item-content '+ (this.props.widget.plugin && this.props.widget.plugin.color ? this.props.widget.plugin.color : 'red')}>
                        <h5 className='ui header dividing'>
                                        <InlineEdit
                                      text={this.state.name}
                                        change={this.dataChanged}
                                        paramName="name"
                                        />
                        </h5>
                        <div className='widgetEditButtons'>
                            <EditWidgetIcon/>
                            <i className="remove link icon small"></i>
                        </div>

                        <div dangerouslySetInnerHTML={this.renderWidget()} />
                    </div>
            </div>
        );
    }
}

