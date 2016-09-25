/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

export default class Header extends Component {
    static isEditMode = false;
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    toggleEditMode() {
        this.props.onWidgetsGridEditModeChange(!this.props.isEditMode);
    }

    render() {
        return (
            <div className="ui top fixed menu teal inverted">
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>
             <div className="rightHeader">
                    <div className="ui inline dropdown" ref={select=>$(select).dropdown()}>
                      <div className="dropDownText text">Manager1</div>
                      <i className="inverted dropdown icon"></i>
                      <div className="menu">
                        <div className="item active selected">
                          Manager1
                        </div>
                        <div className="item">
                          Manager2
                        </div>
                        <div className="item">
                          Manager3
                        </div>
                        <div className="item">
                          Manager4
                        </div>
                      </div>
                    </div>
                <i className="inverted configure link icon large" onClick={this.toggleEditMode.bind(this)}/>
             </div>
           </div>

        );
    }
}