/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class Managers extends Component {
    static propTypes = {
        managers: PropTypes.any.isRequired
    };

    render() {
        var selectedManager = _.find(this.props.managers.items,{id:this.props.managers.selected});
        return (
            <div className="ui inline dropdown item" ref={select=>$(select).dropdown()}>
                <div className="dropDownText text">{selectedManager.name}</div>
                <i className="inverted dropdown icon"></i>
                <div className="menu" style={{minWidth: '190px'}}>
                    {
                        this.props.managers.items.map((manager)=>{
                            return (
                                <div key={manager.ip} className={"item "+ (manager.id === this.props.managers.selected ? 'active selected' : '') }>
                                    <span className="description">{manager.ip}</span>
                                    <span className="text">{manager.name}</span>
                                </div>
                            );

                        })
                    }
                </div>
            </div>

        );
    }
}

