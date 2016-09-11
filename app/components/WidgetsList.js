/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';

//import Flipcard from './Flipcard';
import Widget from './Widget';

export default class WidgetsList extends Component {

    static propTypes = {
        widgets: PropTypes.array.isRequired
    };

    componentDidMount () {
        $('.grid-stack').gridstack({
            cellHeight : 80,
            verticalMargin: 10
        });

        //$('.widget').flip();
    }

    componentWillUpdate(nextProps) {
        var gridStack = $('.grid-stack').data('gridstack');
        // Remove widgets if needed
        const toRemove = _.differenceWith(this.props.widgets, nextProps.widgets, (a, b) => {
            return (a.id === b.id)
        });
        toRemove.forEach(function(r){
            const el = document.getElementById(r.id)
            gridStack.removeWidget(el,false);
        });

        //$('.widget').flip();

    }
    componentDidUpdate(prevProps, prevState) {

        var gridStack = $('.grid-stack').data('gridstack');

        const toAdd = _.differenceWith(this.props.widgets,prevProps.widgets, (a, b) => {
            return (a.id === b.id)
        });

        toAdd.forEach(function(w){
            const el = document.getElementById(w.id)
            gridStack.makeWidget(el);
        });
    }

    render() {
        return (
            <div className="grid-stack">

                {/* temp example widgets */}

                <div className='grid-stack-item' data-gs-x="0" data-gs-y="3" data-gs-width="7" data-gs-height="5">
                    <div className='ui segment purple grid-stack-item-content'>
                        <h5 className='ui header dividing'>Blueprints</h5>
                        <table className="ui very compact table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Created</th>
                                    <th>Updated</th>
                                    <th># Deployments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Blueprint1</td>
                                    <td>2d ago</td>
                                    <td>2d ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>nodecellar</td>
                                    <td>2h ago</td>
                                    <td>2h ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>winpoc</td>
                                    <td>yesterday</td>
                                    <td>yesterday</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>blueprint-2</td>
                                    <td>2 weeks ago</td>
                                    <td>2 weeks ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>nodecellar-simple</td>
                                    <td>yesterday</td>
                                    <td>yesterda</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>aws-example</td>
                                    <td>1h ago</td>
                                    <td>1h ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>my blueprint</td>
                                    <td>2h ago</td>
                                    <td>1h ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                                <tr>
                                    <td>bp222</td>
                                    <td>3h ago</td>
                                    <td>2m ago</td>
                                    <td><div className="ui green horizontal label">4</div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='grid-stack-item' data-gs-x="7" data-gs-y="3" data-gs-width="5" data-gs-height="3">
                    <div className='ui segment yellow grid-stack-item-content'>
                        <h5 className='ui header dividing'>Topology</h5>
                        <img className="ui fluid image" src="/app/images/topology/topology1.png"/>
                    </div>
                </div>

                <div className='grid-stack-item' data-gs-x="7" data-gs-y="6" data-gs-width="5" data-gs-height="5">
                    <div className='ui segment blue grid-stack-item-content'>
                        <h5 className='ui header dividing'>Deployments</h5>
                        <table className="ui very compact table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Blueprint1-dep1</td>
                                <td>2d ago</td>
                                <td>2d ago</td>
                                <td><i className="circular inverted green thumbs up outline icon"></i></td>
                            </tr>
                            <tr>
                                <td>nodecellar</td>
                                <td>2h ago</td>
                                <td>2h ago</td>
                                <td><i className="circular inverted red thumbs down outline icon"></i></td>
                            </tr>
                            <tr>
                                <td>winpoc</td>
                                <td>yesterday</td>
                                <td>yesterday</td>
                                <td><i className="circular inverted orange hourglass half icon"></i></td>
                            </tr>
                            <tr>
                                <td>blueprint-2</td>
                                <td>2 weeks ago</td>
                                <td>2 weeks ago</td>
                                <td><i className="circular inverted green thumbs up outline icon"></i></td>
                            </tr>
                            <tr>
                                <td>nodecellar-simple</td>
                                <td>yesterday</td>
                                <td>yesterday</td>
                                <td><i className="circular inverted green thumbs up outline icon"></i></td>
                            </tr>
                            <tr>
                                <td>aws-example</td>
                                <td>1h ago</td>
                                <td>1h ago</td>
                                <td><i className="circular inverted red thumbs down outline icon"></i></td>
                            </tr>
                            <tr>
                                <td>my blueprint</td>
                                <td>2h ago</td>
                                <td>1h ago</td>
                                <td><i className="circular inverted orange hourglass half icon"></i></td>
                            </tr>
                            <tr>
                                <td>bp222</td>
                                <td>3h ago</td>
                                <td>2m ago</td>
                                <td><i className="circular inverted green thumbs down outline icon"></i></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='grid-stack-item' data-gs-x="0" data-gs-y="0" data-gs-width="4" data-gs-height="2">
                    <div className='ui segment yellow grid-stack-item-content'>
                        <h5 className='ui header dividing'>Deployments</h5>
                        <div className='ui segment basic center aligned'>
                            <div className="ui statistic">
                                <div className="value">
                                    <i className="cube icon"></i> 27
                                </div>
                                <div className="label">
                                    Deployments
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='grid-stack-item' data-gs-x="4" data-gs-y="0" data-gs-width="4" data-gs-height="2">
                    <div className='ui segment green grid-stack-item-content'>
                        <h5 className='ui header dividing'>Servers</h5>
                        <div className='ui segment basic center aligned'>
                            <div className="ui statistic">
                                <div className="value">
                                    <i className="server icon"></i> 12
                                </div>
                                <div className="label">
                                    Servers
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid-stack-item' data-gs-x="8" data-gs-y="0" data-gs-width="4" data-gs-height="2">
                    <div className='ui segment orange grid-stack-item-content '>
                        <h5 className='ui header dividing'>Plugins</h5>
                        <div className='ui segment basic center aligned'>
                            <div className="ui statistic ">
                                <div className="value">
                                    <i className="plug icon"></i> 4
                                </div>
                                <div className="label">
                                    Plugins
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='grid-stack-item' data-gs-x="0" data-gs-y="10" data-gs-width="4" data-gs-height="3">
                    <div className='ui segment orange grid-stack-item-content '>
                        <h5 className='ui header dividing'>Users</h5>
                        <div className='ui segment basic'>

                            <div className="ui link items divided">
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user1.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Stevie Feliciano</div>
                                        <div className="meta">
                                            <span className="cinema">A user</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">admin</div>
                                            <div className="ui label">sysadmin</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user2.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Veronika Ossi</div>
                                        <div className="meta">
                                            <span className="cinema">User blah blah</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">editor</div>
                                        </div>

                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user3.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Jenny Hess</div>
                                        <div className="meta">
                                            <span className="cinema">User blah blah</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">user</div>
                                            <div className="ui label">editor</div>
                                        </div>

                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user4.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Jenny Hess</div>
                                        <div className="meta">
                                            <span className="cinema">User blah blah</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">admin</div>
                                        </div>

                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user5.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Jenny Hess</div>
                                        <div className="meta">
                                            <span className="cinema">User blah blah</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">user</div>
                                        </div>

                                    </div>
                                </div>
                                <div className="item">
                                    <div className="ui tiny image">
                                        <img src="/app/images/users/user6.jpg"/>
                                    </div>
                                    <div className="content">
                                        <div className="header">Jenny Hess</div>
                                        <div className="meta">
                                            <span className="cinema">User blah blah</span>
                                        </div>
                                        <div className="extra">
                                            <div className="ui label">viewer</div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid-stack-item' data-gs-x="0" data-gs-y="13" data-gs-width="8" data-gs-height="5">
                    <div className='ui segment yellow grid-stack-item-content'>
                        <h5 className='ui header dividing'>Some chart</h5>
                        <img className="ui fluid image" src="/app/images/chart.png"/>
                    </div>
                </div>

                {
                    this.props.widgets.map(function(widget){
                        return <Widget key={widget.id} widget={widget}></Widget>;
                    },this)
                }
            </div>
        );
    }
}

