/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class Managers extends Component {
    static propTypes = {
        managers: PropTypes.any.isRequired,
        onManagerConfig: PropTypes.func.isRequired,
        onManagerChange: PropTypes.func.isRequired
    };

    handleClick(event) {
        if (event.target.id === "configureManagerIcon") {
            this.props.onManagerConfig();
        } else {
            this.props.onManagerChange();
        }
    }

    render() {
        var selectedManager = _.find(this.props.managers.items,{id:this.props.managers.selected});
        return (
            <div className="ui inline dropdown item managersMenu" ref={select=>$(select).dropdown({action: 'hide'})}>
                <div className="dropDownText text">{selectedManager.name}</div>
                <i className="inverted dropdown icon"></i>
                <div className="menu">
                    {
                        this.props.managers.items.map((manager)=>{
                            let isManagerSelected = (manager.id === this.props.managers.selected);

                            return (
                                <div key={manager.ip} className={"item "+ (isManagerSelected ? 'active selected' : '') } onClick={this.handleClick.bind(this)} data-text={manager.name} data-value={manager.ip}>
                                    <span className="text">{manager.name}</span>
                                    <span className="description" style={{float: 'none'}}>{manager.ip}</span>
                                    {isManagerSelected && <i className="small configure link icon" id="configureManagerIcon"></i>}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

        );
    }
}

