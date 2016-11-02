/**
 * Created by kinneretzin on 26/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';

export default class Managers extends Component {
    static propTypes = {
        managers: PropTypes.any.isRequired
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        this.dropdownRef.dropdown({action: 'hide'});
    }

    handleClick(event) {
        if (event.target.id === "configureManagerIcon") {
            browserHistory.push("/manager");
        } else {
            //TODO: handle switching between multiple managers
        }
    }

    render() {
        var selectedManager = _.find(this.props.managers.items,{id:this.props.managers.selected});
        return (
            <div className="ui inline dropdown item" ref={select=>this.dropdownRef=$(select)}>
                <div className="dropDownText text">{selectedManager.name}</div>
                <i className="inverted dropdown icon"></i>
                <div className="menu" style={{minWidth: '190px', left: 'auto', right: '0'}}>
                    {
                        this.props.managers.items.map((manager)=>{
                            let isManagerSelected = (manager.id === this.props.managers.selected);

                            return (
                                <div key={manager.ip} className={"item "+ (isManagerSelected ? 'active selected' : '') } onClick={this.handleClick} data-text={manager.name} data-value={manager.ip}>
                                    <span className="text">{manager.name}</span>
                                    <span className="description" style={{float: 'none'}}>{manager.ip}</span>
                                    {isManagerSelected && <i className="small configure link icon" style={{margin: '0 0 0 0.5em', opacity: '0.5'}} id="configureManagerIcon"></i>}
                                </div>
                            );
                        })
                    }
                </div>
            </div>

        );
    }
}

