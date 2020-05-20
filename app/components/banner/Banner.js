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
        hideOnSmallScreen: PropTypes.bool
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

    render() {
        const {
            hideOnSmallScreen,
            isCommunity,
            isExpired,
            isTrial,
            licenseEdition,
            productName,
            productVersion,
            showVersionDetails
        } = this.props;
        const className = hideOnSmallScreen ? 'hide-on-small-screen' : '';

        return (
            <div style={{ lineHeight: '55px' }}>
                <Link to={Consts.HOME_PAGE_PATH}>
                    <Header as="h1" style={{ textDecoration: 'none', display: 'inline-block' }}>
                        <Logo />
                        <ProductName name={productName} className={className} />
                        {showVersionDetails && !isCommunity && (
                            <>
                                <LicenseEdition edition={licenseEdition} className={className} />
                                <ProductVersion version={productVersion} className={className} />
                            </>
                        )}
                    </Header>
                </Link>
                {showVersionDetails && (
                    <LicenseTag
                        isCommunity={isCommunity}
                        isExpired={isExpired}
                        isTrial={isTrial}
                        className={className}
                    />
                )}
            </div>
        );
    }
}
