/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Tenants from '../../containers/Tenants';
import Manager from '../../containers/Manager';
import Users from '../../containers/Users';
import Consts from '../../utils/consts';

export default class Header extends Component {

    static propTypes = {
        manager: PropTypes.any.isRequired,
        mode: PropTypes.string.isRequired
    };

    render() {
        let isModeMain = this.props.mode === Consts.MODE_MAIN;

        return (
            <div className="ui top fixed menu teal inverted secondary">
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>
                <div className="right menu">
                    {
                        isModeMain
                        ?
                        <div className='item configPanel'>
                            <Manager manager={this.props.manager}/>
                            <div>
                                <Tenants manager={this.props.manager}/>
                                <Users manager={this.props.manager} showAllOptions={true}/>
                            </div>
                        </div>
                        :
                        <div className='item configPanel'>
                            <Users manager={this.props.manager} showAllOptions={false}/>
                        </div>
                    }
                </div>
            </div>
        );
    }
}