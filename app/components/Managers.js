/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import config from '../config.json';

export default class Managers extends Component {
    static propTypes = {
        managers: PropTypes.any.isRequired,
        onManagerConfig: PropTypes.func.isRequired,
        onManagerChange: PropTypes.func.isRequired
    };

    constructor(props,context){
        super(props, context);

        this.state = {
            selectedManagerStatus: ''
        };
    }

    handleClick(event) {
        if (event.target.id === "configureManagerIcon") {
            this.props.onManagerConfig();
        } else {
            this.props.onManagerChange();
        }
    }


    _getManagerUrl(selectedManager) {
        return `http://${config.proxyIp}:8000/?su=http://${selectedManager.ip}`;
    }

    _getManagerStatus(selectedManager)
    {
        var thi$ = this;
        $.ajax({
            url: thi$._getManagerUrl(selectedManager) + '/api/v2.1/events?_include=status',
            dataType: 'json',
            method: 'get',
            success: function(response) {this.setState({selectedManagerStatus: response.status});}
        })
    }

    render() {
        var selectedManager = _.find(this.props.managers.items,{id:this.props.managers.selected});
        this._getManagerStatus(selectedManager);
        return (
            <div className="ui inline dropdown item managersMenu" ref={select=>$(select).dropdown({action: 'hide'})}>
                <div className="dropDownText text">
                                {selectedManager.name}
                                {
                                    this.state.selectedManagerStatus ?
                                        <i className="circle icon small green"/>
                                    :
                                        <i className="circle icon small red"/>
                                }</div>
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

