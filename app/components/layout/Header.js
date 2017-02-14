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
        mode: PropTypes.string.isRequired,
        whiteLabel : PropTypes.object,
    };

    setStyle (container) {
        var isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        if (isWhiteLabelEnabled) {
            var background = this.props.whiteLabel.mainColor ? 'background-color: '+this.props.whiteLabel.mainColor +' !important' : '';
            var color = this.props.whiteLabel.headerTextColor ? 'color: '+ this.props.whiteLabel.headerTextColor + '!important' : null;

            $(container).attr('style',background);

            if (color) {
                $(container).find('.right.menu > .item, .right.menu > .item .dropdown > .dropDownText, .right.menu > .item .dropdown .icon').attr('style',color);
            }
        }
    }

    render() {
        var isWhiteLabelEnabled = _.get(this.props,'whiteLabel.enabled');
        let isModeMain = this.props.mode === Consts.MODE_MAIN;

        return (
            <div className="ui top fixed menu teal inverted secondary" ref={this.setStyle.bind(this)}>
                <div className="logo">
                    <img src={isWhiteLabelEnabled ? this.props.whiteLabel.logoUrl : "/app/images/Cloudify-logo.png"}></img>
                </div>
                <div className="right menu">
                    {
                        isModeMain
                        ?
                        <div className='item configPanel'>
                            <div className='managerAndTenants'>
                                <Manager manager={this.props.manager}/>
                                <Tenants manager={this.props.manager}/>
                            </div>
                            <Users manager={this.props.manager} showAllOptions={true}/>
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