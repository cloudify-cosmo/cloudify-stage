/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Consts from '../../utils/consts';

import { Header } from '../basic';
import LicenseTag from './LicenseTag';
import Logo from './Logo';
import ProductFullName from './ProductFullName';
import ProductVersion from './ProductVersion';


export default class Banner extends Component {

    static propTypes = {
        isCommunity: PropTypes.bool,
        isExpired: PropTypes.bool,
        isTrial: PropTypes.bool,
        productName: PropTypes.string,
        productVersion: PropTypes.string,
        licenseEdition: PropTypes.string,
        inverted: PropTypes.bool,
        hideOnSmallScreen: PropTypes.bool,
    };

    static defaultProps = {
        isCommunity: false,
        isExpired: false,
        isTrial: false,
        productName: '',
        productVersion: '',
        licenseEdition: '',
        inverted: false,
        hideOnSmallScreen: true
    };

    render () {
        const className = this.props.hideOnSmallScreen ? 'hide-on-small-screen' : '';

        return (
            <div style={{lineHeight: '55px'}}>
                <Link to={Consts.HOME_PAGE_PATH}>
                    <Header as='h1' style={{textDecoration: 'none', display: 'inline-block'}}>
                        <Logo />
                        <ProductFullName edition={this.props.licenseEdition} name={this.props.productName}
                                         inverted={this.props.inverted} className={className} />
                        {
                            !this.props.isCommunity &&
                            <ProductVersion version={this.props.productVersion}
                                            className={className} />
                        }
                    </Header>
                </Link>
                <LicenseTag isCommunity={this.props.isCommunity} isExpired={this.props.isExpired}
                            isTrial={this.props.isTrial} className={className} />
            </div>
        )
    }
}