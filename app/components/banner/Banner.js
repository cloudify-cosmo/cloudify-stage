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
import ProductName from './ProductName';
import ProductVersion from './ProductVersion';
import LicenseEdition from './LicenseEdition';


export default class Banner extends Component {

    static propTypes = {
        isCommunity: PropTypes.bool,
        isExpired: PropTypes.bool,
        isTrial: PropTypes.bool,
        productName: PropTypes.string,
        productVersion: PropTypes.string,
        licenseEdition: PropTypes.string,
        hideOnSmallScreen: PropTypes.bool,
    };

    static defaultProps = {
        isCommunity: false,
        isExpired: false,
        isTrial: false,
        productName: '',
        productVersion: '',
        licenseEdition: '',
        hideOnSmallScreen: true
    };

    render () {
        const className = this.props.hideOnSmallScreen ? 'hide-on-small-screen' : '';

        return (
            <div style={{lineHeight: '55px'}}>
                <Link to={Consts.HOME_PAGE_PATH}>
                    <Header as='h1' style={{textDecoration: 'none', display: 'inline-block'}}>
                        <Logo />
                        <ProductName name={this.props.productName} className={className} />
                        {
                            this.props.showVersionDetails && !this.props.isCommunity &&
                            <React.Fragment>
                                <LicenseEdition edition={this.props.licenseEdition} className={className} />
                                <ProductVersion version={this.props.productVersion} className={className} />
                            </React.Fragment>
                        }
                    </Header>
                </Link>
                {
                    this.props.showVersionDetails &&
                    <LicenseTag isCommunity={this.props.isCommunity} isExpired={this.props.isExpired}
                                isTrial={this.props.isTrial} className={className} />
                }
            </div>
        )
    }
}