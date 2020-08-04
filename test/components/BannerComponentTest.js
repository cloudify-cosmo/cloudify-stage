/**
 * Created by jakubniezgoda on 22/03/2019.
 */

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { MemoryRouter as Router } from 'react-router-dom';
import Consts from '../../app/utils/consts.js';
import ConnectedBanner from '../../app/containers/banner/Banner.js';
import Banner from '../../app/components/banner/Banner.jsx';
import * as BasicComponents from '../../app/components/basic';

import { createToolbox } from '../../app/utils/Toolbox';
import licenses from '../resources/licenses';
import versions from '../resources/versions';

describe('(Component) Banner', () => {
    let bannerComponent = null;
    global.Stage = { Basic: BasicComponents };

    const verifyProps = (
        isCommunity,
        isExpired,
        isTrial,
        productName,
        productVersion,
        licenseEdition,
        hideOnSmallScreen
    ) => {
        expect(bannerComponent.props().isCommunity).to.be.eql(isCommunity);
        expect(bannerComponent.props().isExpired).to.be.eql(isExpired);
        expect(bannerComponent.props().isTrial).to.be.eql(isTrial);
        expect(bannerComponent.props().productName).to.be.eql(productName);
        expect(bannerComponent.props().productVersion).to.be.eql(productVersion);
        expect(bannerComponent.props().licenseEdition).to.be.eql(licenseEdition);
        expect(bannerComponent.props().hideOnSmallScreen).to.be.eql(hideOnSmallScreen);
    };

    const verifyTag = (isPresent = false, tag = null, isLinked = false) => {
        const tagComponent = bannerComponent.find('LicenseTag');
        expect(tagComponent).to.have.length(isPresent ? 1 : 0);
        if (isPresent) {
            const labelComponent = bannerComponent.find('Label');
            if (_.isEmpty(tag)) {
                expect(labelComponent).to.have.length(0);
            } else {
                expect(labelComponent.text()).to.be.eql(tag);
                const linkComponent = tagComponent.find('Link');
                expect(linkComponent).to.have.length(isLinked ? 1 : 0);
                if (isLinked) {
                    expect(linkComponent.props().to).to.be.eql(Consts.LICENSE_PAGE_PATH);
                }
            }
        }
    };

    const verifyFullName = fullName => {
        const headerComponent = bannerComponent.find('Header');
        expect(headerComponent.text()).to.be.eql(fullName);

        const linkComponent = bannerComponent.find('Link').first();
        expect(linkComponent).to.have.length(1);
        expect(linkComponent.props().to).to.be.eql(Consts.HOME_PAGE_PATH);
    };

    const getLicenseEdition = license => {
        return license.license_edition || '';
    };

    const getLicenseState = (data, isRequired, status) => {
        return { data, isRequired, status };
    };

    const getWhiteLabel = (productName, showVersionDetails) => {
        return {
            productName: _.isUndefined(productName) ? 'Cloudify' : productName,
            showVersionDetails: _.isUndefined(showVersionDetails) ? true : showVersionDetails
        };
    };

    const mockStoreAndRender = (license, version, whiteLabel) => {
        const mockStore = configureMockStore();
        const store = mockStore({
            manager: {
                license,
                version
            },
            config: {
                app: {
                    whiteLabel
                }
            }
        });
        createToolbox(store);

        const componentsTree = mount(
            <Provider store={store}>
                <Router>
                    <ConnectedBanner hideOnSmallScreen />
                </Router>
            </Provider>
        );
        bannerComponent = componentsTree.find(Banner);
    };

    describe('shows full name', () => {
        it('without tag for active paying license', () => {
            const license = getLicenseState(licenses.activePayingLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activePayingLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, false, false, 'Cloudify', '4.6', edition, true);
            verifyFullName('Cloudify Spire 4.6');
            verifyTag(true, null);
        });

        it('without tag for active paying license without license edition', () => {
            const licenseWithoutEdition = { ...licenses.activePayingLicense, license_edition: '' };
            const license = getLicenseState(licenseWithoutEdition, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenseWithoutEdition);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, false, false, 'Cloudify', '4.6', edition, true);
            verifyFullName('Cloudify 4.6');
            verifyTag(true, null);
        });

        it('with trial tag for active trial license', () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activeTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, false, true, 'Cloudify', '4.6', edition, true);
            verifyFullName('Cloudify Spire 4.6');
            verifyTag(true, 'Trial', true);
        });

        it('with expired tag for expired paying license', () => {
            const license = getLicenseState(licenses.expiredPayingLicense, true, Consts.LICENSE.EXPIRED);
            const edition = getLicenseEdition(licenses.expiredPayingLicense);
            const whiteLabel = getWhiteLabel('Cloudify', true);
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, true, false, 'Cloudify', '4.6', edition, true);
            verifyFullName('Cloudify Spire 4.6');
            verifyTag(true, 'Expired', true);
        });

        it('with expired tag for expired trial license', () => {
            const license = getLicenseState(licenses.expiredTrialLicense, true, Consts.LICENSE.EXPIRED);
            const edition = getLicenseEdition(licenses.expiredTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, true, true, 'Cloudify', '4.6', edition, true);
            verifyFullName('Cloudify Spire 4.6');
            verifyTag(true, 'Expired', true);
        });
    });

    describe('does not show full name', () => {
        it('with community tag when version edition is community', () => {
            const license = getLicenseState({}, false, Consts.LICENSE.EMPTY);
            const edition = getLicenseEdition({});
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, versions.community, whiteLabel);

            verifyProps(true, false, false, 'Cloudify', '19.02.22~community', edition, true);
            verifyFullName('Cloudify');
            verifyTag(true, 'Community', false);
        });

        it('without tag when version edition is premium and white labelling customization is done', () => {
            const license = getLicenseState(licenses.expiredTrialLicense, true, Consts.LICENSE.EXPIRED);
            const edition = getLicenseEdition(licenses.expiredTrialLicense);
            const whiteLabel = getWhiteLabel('VNFM', false);
            mockStoreAndRender(license, versions.premium, whiteLabel);

            verifyProps(false, true, true, 'VNFM', '4.6', edition, true);
            verifyFullName('VNFM');
            verifyTag(false, null);
        });
    });

    describe('shows version part properly', () => {
        it('when using development version', () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activeTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, { ...versions.premium, version: '4.6.4-dev1' }, whiteLabel);

            verifyProps(false, false, true, 'Cloudify', '4.6.4-dev1', edition, true);
            verifyFullName('Cloudify Spire 4.6');
            verifyTag(true, 'Trial', true);
        });

        it('when using long version', () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activeTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, { ...versions.premium, version: '5.1.2432-build123-commit-42342' }, whiteLabel);

            verifyProps(false, false, true, 'Cloudify', '5.1.2432-build123-commit-42342', edition, true);
            verifyFullName('Cloudify Spire 5.1');
            verifyTag(true, 'Trial', true);
        });

        it('when version is not valid Semantic Version', () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activeTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, { ...versions.premium, version: '4te3s1t' }, whiteLabel);

            verifyProps(false, false, true, 'Cloudify', '4te3s1t', edition, true);
            verifyFullName('Cloudify Spire');
            verifyTag(true, 'Trial', true);
        });

        it('when version is empty', () => {
            const license = getLicenseState(licenses.activeTrialLicense, true, Consts.LICENSE.ACTIVE);
            const edition = getLicenseEdition(licenses.activeTrialLicense);
            const whiteLabel = getWhiteLabel();
            mockStoreAndRender(license, { ...versions.premium, version: '' }, whiteLabel);

            verifyProps(false, false, true, 'Cloudify', '', edition, true);
            verifyFullName('Cloudify Spire');
            verifyTag(true, 'Trial', true);
        });
    });
});
