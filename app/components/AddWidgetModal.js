/**
 * Created by kinneretzin on 08/09/2016.
 */

/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class AddWidgetModal extends Component {
    static propTypes = {
        plugins: PropTypes.array.isRequired,
        onWidgetAdded: PropTypes.func.isRequired,
        onPluginInstalled: PropTypes.func.isRequired
    };

    componentDidMount () {
        $('.large.modal')
           .modal('show');
    }

    render() {
        return (
            <div className="ui modal addWidgetModal">
                <div className="ui segment basic large">
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
                                                <div className="ui right floated secondary button small">
                                                    Add
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                        <div className="item">
                            <div className='ui image small bordered'>
                                <img src="/app/images/topology/topology4.png"/>
                            </div>
                            <div className="content">
                                <a className="header">Topology</a>
                                <div className="meta">
                                    <span>This widget shows topology ...</span>
                                </div>
                                <div className="description">
                                </div>
                                <div className="extra">
                                    <div className="ui right floated secondary button small">
                                        Add
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className='ui image small bordered'>
                                <img src="/app/images/topology/topology2.png"/>
                            </div>
                            <div className="content">
                                <a className="header">Blueprints</a>
                                <div className="meta">
                                    <span>list of blueprints</span>
                                </div>
                                <div className="description">
                                </div>
                                <div className="extra">
                                    <div className="ui right floated secondary button small">
                                        Add
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className='ui image small bordered'>
                                <img src="/app/images/topology/topology1.png"/>
                            </div>
                            <div className="content">
                                <a className="header">Deployments</a>
                                <div className="meta">
                                    <span>This widget a list of deployments</span>
                                </div>
                                <div className="description">
                                </div>
                                <div className="extra">
                                    <div className="ui right floated secondary button small">
                                        Add
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className='ui image small bordered'>
                                <img src="/app/images/topology/topology5.png"/>
                            </div>
                            <div className="content">
                                <a className="header">Users</a>
                                <div className="meta">
                                    <span>Users list</span>
                                </div>
                                <div className="description">
                                </div>
                                <div className="extra">
                                    <div className="ui right floated secondary button small">
                                        Add
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className='ui image small bordered'>
                                <img src="/app/images/topology/topology3.png"/>
                            </div>
                            <div className="content">
                                <a className="header">KPI</a>
                                <div className="meta">
                                    <span>Shows a selected KPI</span>
                                </div>
                                <div className="description">
                                </div>
                                <div className="extra">
                                    <div className="ui right floated secondary button small">
                                        Add
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="fluid ui button">Install new plugin</button>
                </div>
            </div>
        );
    }
}
