/**
 * Created by kinneretzin on 08/09/2016.
 */

/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class AddWidgetPopup extends Component {
    static propTypes = {
        plugins: PropTypes.array.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onPluginInstalled: PropTypes.func.isRequired
    };

    //componentDidMount () {
    //    $('.addWidgetBtn')
    //        .popup({
    //            transition: 'vertical flip',
    //            popup: '.addWidgetPopup',
    //            on: 'click',
    //            position: 'bottom left'
    //        })
    //    ;
    //}

    addWidget(widget) {
        this.props.onWidgetAdded(widget);
        $('.addWidgetBtn').popup('hide');
    }

    render() {
        return (
            <div className="ui very wide popup addWidgetPopup">
                <div className="ui segment basic compact">
                    <div className="ui icon input fluid mini">
                        <i className="search icon"></i>
                        <input type="text" placeholder="Search widgets ..."/>
                    </div>

                    <div className="ui divider"></div>

                    <div className="ui items divided widgetsList">
                        {
                            this.props.plugins.map(function(widget){
                                return (
                                    <div className="item" key={widget.name}>
                                        <div className='ui image small bordered'>
                                            <img src={'/plugins/'+widget.name+'/widget.png'}/>
                                        </div>
                                        <div className="content">
                                            <a className="header">{widget.name}</a>
                                            <div className="meta">
                                                <span>This widget shows topology ...</span>
                                            </div>
                                            <div className="description">
                                            </div>
                                            <div className="extra">
                                                <div className="ui right floated secondary button small" onClick={this.addWidget.bind(this,widget)}>
                                                    Add
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },this)
                        }
                    </div>

                    <button className="fluid ui button">Install new plugin</button>
                </div>
            </div>
        );
    }
}
